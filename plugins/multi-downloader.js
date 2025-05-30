import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie a URL do vídeo.\n\nExemplo:\n${usedPrefix + command} https://www.tiktok.com/@exemplo/video/123`

  await m.reply('⏳ Baixando vídeo, aguarde...')

  try {
    // Faz a requisição à API pública
    const res = await axios.get('https://nayan-video-downloader.vercel.app/alldown', {
      params: { url: text }
    })
    const result = res.data

    // Validações básicas
    if (!result.status || !result.data?.low) {
      throw new Error('Resposta inválida da API')
    }

    const { title, low, high } = result.data
    const videoUrl = high || low
    const caption = `🎬 *${title || 'Vídeo'}*\n\n🔗 Fonte: ${text}`

    // Envia o vídeo
    await conn.sendFile(
      m.chat,
      videoUrl,
      'video.mp4',
      caption,
      m
    )
  } catch (e) {
    console.error(e)
    throw '❌ Erro ao baixar o vídeo. Verifique a URL e tente novamente.'
  }
}

handler.help = ['ttkdl', 'fbdl', 'igdl', 'ytmdl', 'twtdl', 'gdrvdl', 'capdl', 'threadsdl', 'likeedl', 'ptdl', 'multidl'].map(cmd => `${cmd} <url>`)
handler.tags = ['downloader']
handler.command = /^(ttkdl|fbdl|igdl|ytmdl|twtdl|gdrvdl|capdl|threadsdl|likeedl|ptdl|multidl)$/i
handler.register = true

export default handler
