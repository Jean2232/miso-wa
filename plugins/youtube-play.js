import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Use o comando assim:\n${usedPrefix}${command} <nome da música>`

  try {
    const apiUrl = `https://api.nekorinn.my.id/downloader/ytplay-savetube?q=${encodeURIComponent(text)}`
    const { data } = await axios.get(apiUrl)

    if (!data.status || !data.result || !data.result.downloadUrl) {
      throw '❌ Não foi possível obter o áudio.'
    }

    const audioUrl = data.result.downloadUrl
    const { title, channel, duration, imageUrl, link } = data.result.metadata

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `🎵 *${title}*\n📺 Canal: ${channel}\n⏱️ Duração: ${duration}\n🔗 ${link}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    throw '🚫 Erro ao buscar áudio. Tente novamente mais tarde.'
  }
}

handler.help = ['play'].map(v => v + ' <termo>')
handler.tags = ['downloader']
handler.command = /^play$/i

export default handler
