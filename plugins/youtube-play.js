import axios from 'axios'
import qs from 'qs'

async function searchYouTube(query) {
  const res = await axios.get('https://www.youtube.com/results', {
    params: { search_query: query },
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  const videoId = res.data.match(/"videoId":"(.*?)"/)?.[1]
  if (!videoId) throw 'Vídeo não encontrado'
  return `https://www.youtube.com/watch?v=${videoId}`
}
async function ssvidDownloader(url, forceType = null) {
  if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url))
    throw 'URL não válida'

  // Busca as opções disponíveis
  const res = await axios.post(
    'https://ssvid.net/api/ajax/search',
    qs.stringify({ query: url, vt: 'home' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  )

  const data = res.data
  if (!data || data.status !== 'ok')
    throw 'Falha ao buscar dados do vídeo'

  const { title, a: author, t: duration, vid } = data
  const thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
  const formats = []

  for (const q in data.links?.mp4 || {}) {
    const v = data.links.mp4[q]
    formats.push({
      quality: v.q_text,
      size: v.size,
      format: v.f,
      type: 'video',
      k: v.k
    })
  }

  for (const q in data.links?.mp3 || {}) {
    const a = data.links.mp3[q]
    formats.push({
      quality: a.q_text,
      size: a.size,
      format: a.f,
      type: 'audio',
      k: a.k
    })
  }

  let selected = formats.find(f => f.quality.includes('360p')) || formats[0]
  if (forceType === 'audio')
    selected = formats.find(f => f.type === 'audio') || selected
  if (forceType === 'video')
    selected = formats.find(f => f.type === 'video') || selected

  if (!selected || !selected.k)
    throw 'Nenhum formato disponível para conversão'

  const conv = await axios.post(
    'https://ssvid.net/api/ajax/convert',
    qs.stringify({ vid, k: selected.k }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'https://ssvid.net/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
      }
    }
  )

  const converted = conv.data
  const downloadUrl = converted?.url || converted?.dlink
  if (!downloadUrl)
    throw 'Falha ao converter a mídia'

  return {
    title,
    author,
    duration,
    thumbnail,
    download: {
      url: downloadUrl,
      format: selected.format,
      quality: selected.quality,
      size: selected.size,
      type: selected.type
    }
  }
}

const handler = async (m, { text, command, conn }) => {
  if (!text)
    throw 'Exemplo de uso:\n.play <música>\n.ytmp3 <url>\n.ytmp4 <url>'

  if (command === 'play') {
    const url = await searchYouTube(text)
    const res = await ssvidDownloader(url, 'audio')
    const caption = `🎶 Y O U T U B E - P L A Y\n
🖊️ Título: ${res.title}
✨ Autor: ${res.author}
🕐 Duração: ${res.duration}
📌 Qualidade: ${res.download.quality}`

    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: res.title,
            body: 'Play Music 🧸',
            thumbnailUrl: res.thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: res.download.url },
        mimetype: 'audio/mp4',
        ptt: false
      },
      { quoted: m }
    )
  }

  if (command === 'ytmp3') {
    if (!text.includes('youtu'))
      throw 'Digite uma URL do YouTube válida'
    const res = await ssvidDownloader(text, 'audio')
    const caption = `🎶 Y O U T U B E - AUDIO\n
🖊️ Título: ${res.title}
✨ Autor: ${res.author}
🕐 Duração: ${res.duration}
📌 Qualidade: ${res.download.quality}`

    await conn.sendMessage(
      m.chat,
      {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: res.title,
            body: 'YouTube Audio ✨',
            thumbnailUrl: res.thumbnail,
            sourceUrl: text,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: res.download.url },
        mimetype: 'audio/mp4',
        ptt: false
      },
      { quoted: m }
    )
  }

  if (command === 'ytmp4') {
    if (!text.includes('youtu'))
      throw 'Digite uma URL do YouTube válida'
    const res = await ssvidDownloader(text, 'video')
    const caption = `🎬 Y O U T U B E - VÍDEO\n
🖊️ Título: ${res.title}
✨ Autor: ${res.author}
🕐 Duração: ${res.duration}
📌 Qualidade: ${res.download.quality}`

    await conn.sendMessage(
      m.chat,
      {
        video: { url: res.download.url },
        mimetype: 'video/mp4',
        caption
      },
      { quoted: m }
    )
  }

  // Reação final
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = handler.command = ['play', 'ytmp3', 'ytmp4']
handler.tags = ['downloader']

export default handler
