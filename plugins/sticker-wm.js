import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!m.quoted) throw 'Responda ao sticker!'
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw 'Responda a um sticker!'
    let img = await m.quoted.download()
    if (!img) throw 'Responda a um sticker válido!'
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
    else throw 'Falha na conversão do sticker.'
  }
}

handler.help = ['wm <pack>|<autor>', 'rn <pack>|<autor>', 'rename <pack>|<autor>', 'roubar <pack>|<autor>']
handler.tags = ['sticker']
handler.command = /^wm|rn|rename|roubar$/i

export default handler
