import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Use o comando assim:\n${usedPrefix}${command} [-audio|-video] <url do TikTok>`

  const args = text.split(/\s+/)
  const flags = args.filter(a => a.startsWith('-')).join(' ')
  const url = args.find(a => a.startsWith('http'))

  if (!url) throw '❌ URL do TikTok não encontrada.'

  try {
    const api = `https://api.nekorinn.my.id/downloader/tikwm?url=${encodeURIComponent(url)}`
    const { data } = await axios.get(api)

    if (!data.status || !data.result?.videoUrl) {
      throw '⚠️ Não foi possível baixar o vídeo. Verifique o link.'
    }

    const { result } = data
    const { title, videoUrl, musicUrl, music_info, author } = result

    if (flags.includes('-audio')) {
      await conn.sendMessage(m.chat, {
        audio: { url: musicUrl },
        mimetype: 'audio/mpeg',
        fileName: `${music_info.title || 'TikTok Music'}.mp3`,
        ptt: false
      }, { quoted: m })
    } else if (flags.includes('-video')) {
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `🎥 *Vídeo TikTok*\n@${author.username}`,
        mimetype: 'video/mp4'
      }, { quoted: m })
    } else {
      // padrão: envia os dois
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `🎥 *Vídeo TikTok*\n@${author.username}`,
        mimetype: 'video/mp4'
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        audio: { url: musicUrl },
        mimetype: 'audio/mpeg',
        fileName: `${music_info.title || 'TikTok Music'}.mp3`,
        ptt: false
      }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    throw `🚫 Erro ao processar o link. Certifique-se que a URL é válida.\n${e.message || e}`
  }
}

handler.help = ['tiktokdl <url>', 'ttkdl <url>', 'ttkdl -audio <url>', 'ttkdl -video <url>']
handler.tags = ['downloader']
handler.command = /^(tiktokdl|ttkdl)$/i
handler.register = true
handler.limit = 5

export default handler