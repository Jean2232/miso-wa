import pkg from 'nayan-videos-downloader'
const { alldown } = pkg

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `❌ Envie a URL do vídeo.\n\nExemplo:\n${usedPrefix + command} https://...`

  m.reply('⏳ Baixando vídeo, aguarde...')

  try {
    const result = await alldown(text)

    if (!result.status || !result.data?.low && !result.data?.high)
      throw '❌ Não foi possível baixar o vídeo. Verifique a URL.'

    let caption = `🎬 *${result.data.title || 'Vídeo'}*\n🔗 ${text}`

    await conn.sendFile(m.chat, result.data.high || result.data.low, 'video.mp4', caption, m)
  } catch (e) {
    console.error(e)
    throw '❌ Erro ao baixar o vídeo.'
  }
}

handler.help = ['ttkdl', 'fbdl', 'igdl', 'ytmdl', 'twtdl', 'gdrvdl', 'capdl', 'threadsdl', 'likeedl', 'ptdl', 'multidl'].map(cmd => `${cmd} <url>`)
handler.tags = ['downloader']
handler.command = /^(ttkdl|fbdl|igdl|ytmdl|twtdl|gdrvdl|capdl|threadsdl|likeedl|ptdl|multidl)$/i
handler.register = true

export default handler
