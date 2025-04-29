import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  let user = m.mentionedJid && m.mentionedJid[0]
  if (!user) user = m.sender

  let pp
  try {
    pp = await conn.profilePictureUrl(user, 'image')
  } catch {
    pp = 'https://i.ibb.co/3kM7ZrR/avatar.png' // imagem padrão
  }

  const url = `https://api.nekorinn.my.id/tools/to-hijab?imageUrl=${encodeURIComponent(pp)}`

  try {
    let res = await fetch(url)
    if (!res.ok) throw 'Erro ao acessar a API Hijab'
    let buffer = await res.buffer()

    await conn.sendFile(m.chat, buffer, 'hijab.jpg', '', m)
  } catch (e) {
    console.error(e)
    throw '❌ Falha ao gerar a imagem com hijab. Tente novamente.'
  }
}

handler.help = ['hijab [@usuário]']
handler.tags = ['tools']
handler.command = /^hijab$/i

export default handler
