import ytSearch from 'yt-search'
import pkg from 'nayan-videos-downloader'

const { alldown } = pkg

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Use o comando assim:\n${usedPrefix}${command} <nome da música>`

  m.reply('🔍 Buscando música...')

  try {
    const search = await ytSearch(text)
    const video = search.videos[0]

    if (!video || !video.url) throw '❌ Nenhum resultado encontrado.'

    m.reply('⏳ Baixando áudio, aguarde...')

    const result = await alldown(video.url)

    if (!result.status || !result.data?.audio) throw '❌ Não foi possível baixar o áudio.'

    const { title, thumbnail, duration, author } = video
    const caption = `🎵 *${title}*\n📺 Canal: ${author.name}\n⏱️ Duração: ${duration}\n🔗 ${video.url}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m })

    await conn.sendFile(m.chat, result.data.audio, `${title}.mp3`, null, m, null, {
      mimetype: 'audio/mpeg'
    })
  } catch (e) {
    console.error(e)
    throw '🚫 Erro ao buscar ou baixar o áudio.'
  }
}

handler.help = ['play <música>']
handler.tags = ['downloader']
handler.command = /^play$/i
handler.register = true

export default handler
