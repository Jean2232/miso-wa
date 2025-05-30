// youtube-play.js
import { ytdl, ytdltxt, ytdlaud, ytdlaudtxt } from '../lib/savetube.js'

const handler = async (m, { text, command, conn }) => {
  if (!text) {
    throw 'Uso:\n.play <música>\n.ytmp3 <url>\n.ytmp4 <url>'
  }

  let res, data, caption

  switch (command) {
    case 'play':
      // busca & baixa o áudio a partir de texto
      res = await ytdlaudtxt(text)
      if (!res.status) throw res.error
      data = res.response

      caption = `🎶 Y O U T U B E - P L A Y

🖊️ Título: ${data.title}
🕐 Duração: ${data.duration}
📌 Qualidade: ${data.quality}`

      // envia mensagem com preview
      await conn.sendMessage(
        m.chat,
        {
          text: caption,
          contextInfo: {
            externalAdReply: {
              title: data.title,
              body: 'Play Music 🧸',
              thumbnailUrl: data.thumbnail,
              sourceUrl: `https://www.youtube.com/watch?v=${data.id}`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      )

      // envia áudio
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: data.url },
          mimetype: 'audio/mp4',
          ptt: false
        },
        { quoted: m }
      )
      break

    case 'ytmp3':
      // exige URL
      if (!text.includes('youtu')) {
        throw 'Digite uma URL do YouTube válida'
      }
      res = await ytdlaud(text)
      if (!res.status) throw res.error
      data = res.response

      caption = `🎶 Y O U T U B E - AUDIO

🖊️ Título: ${data.title}
🕐 Duração: ${data.duration}
📌 Qualidade: ${data.quality}`

      await conn.sendMessage(
        m.chat,
        {
          text: caption,
          contextInfo: {
            externalAdReply: {
              title: data.title,
              body: 'YouTube Audio ✨',
              thumbnailUrl: data.thumbnail,
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
          audio: { url: data.url },
          mimetype: 'audio/mp4',
          ptt: false
        },
        { quoted: m }
      )
      break

    case 'ytmp4':
      if (!text.includes('youtu')) {
        throw 'Digite uma URL do YouTube válida'
      }
      res = await ytdl(text)
      if (!res.status) throw res.error
      data = res.response

      caption = `🎬 Y O U T U B E - VÍDEO

🖊️ Título: ${data.title}
🕐 Duração: ${data.duration}
📌 Qualidade: ${data.quality}`

      await conn.sendMessage(
        m.chat,
        {
          video: { url: data.url },
          mimetype: 'video/mp4',
          caption
        },
        { quoted: m }
      )
      break
  }

  // reação de confirmação
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = handler.command = ['play', 'ytmp3', 'ytmp4']
handler.tags = ['downloader']

export default handler
