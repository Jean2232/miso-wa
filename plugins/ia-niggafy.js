import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  let user = m.mentionedJid && m.mentionedJid[0]
  if (!user) user = m.sender

  let pp
  try {
    pp = await conn.profilePictureUrl(user, 'image')
  } catch {
    pp = 'https://i.ibb.co/3kM7ZrR/avatar.png' // fallback
  }

  const url = `https://apizell.web.id/ai/hitamkan2?imageUrl=${encodeURIComponent(pp)}`

  try {
    let res = await fetch(url)
    if (!res.ok) throw 'Erro ao acessar a API'
    let buffer = await res.buffer()

    await conn.sendFile(m.chat, buffer, 'niggafy.jpg', '', m)
  } catch (e) {
    console.error(e)
    throw '❌ Falha ao gerar imagem. Tente novamente.'
  }
}

handler.help = ['niggafy [@usuário]']
handler.tags = ['tools']
handler.command = /^niggafy$/i

export default handler
