import { toDataURL } from 'qrcode'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '❌ Use: .qr <texto para gerar o código>', m)

  conn.sendFile(
    m.chat,
    await toDataURL(text.slice(0, 2048), { scale: 8 }),
    'qrcode.png',
    '✅ Aqui está seu QR Code!',
    m
  )
}

handler.help = ['qr <texto>']
handler.tags = ['tools']
handler.command = /^qr(code)?$/i

export default handler
