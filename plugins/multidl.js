import pkg from 'nayan-videos-downloader'
const { alldown } = pkg

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `❌ Envie a URL do vídeo.\n\nExemplo:\n${usedPrefix + command} https://www.tiktok.com/@exemplo/video/123`

  m.reply('⏳ Baixando vídeo, aguarde...')

  try {
    const result = await alldown(text)

    if (!result.status || !result.media?.low) throw '❌ Não foi possível baixar o vídeo.'

    let caption = `🎬 *${result.media.title || 'Vídeo'}*\n\n🔗 Fonte: ${text}`

    await conn.sendFile(m.chat, result.media.high || result.media.low, 'video.mp4', caption, m)
  } catch (e) {
    console.error(e)
    throw '❌ Erro ao baixar o vídeo. Verifique a URL e tente novamente.'
  }
}

handler.help = ['multidl <url>']
handler.tags = ['downloader']
handler.command = /^multidl$/i
handler.register = true

export default handler
