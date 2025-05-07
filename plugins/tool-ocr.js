import { uploadPomf } from '../lib/uploadImage.js'
import ocrapi from 'ocr-space-api-wrapper'

async function realizarOCR(url) {
  try {
    return await ocrapi.ocrSpace(url)
  } catch (error) {
    console.error(error)
    return null
  }
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) throw `❌ Responda uma imagem com ${usedPrefix}${command}`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `❌ Tipo de mídia ${mime} não suportado`

    let img = await q.download()
    let url = await uploadPomf(img)

    m.reply('⏳ Processando OCR...')

    let tentativas = 0
    let resultado

    do {
      resultado = await realizarOCR(url)
      tentativas++
    } while (!resultado && tentativas < 5)

    if (resultado?.ParsedResults?.length > 0) {
      await m.reply(`${resultado.ParsedResults[0].ParsedText}`)
    } else {
      throw '❌ Nenhum texto encontrado na imagem.'
    }
  } catch (error) {
    console.error(error)
    m.reply(`❌ Use: ${usedPrefix}${command} em resposta a uma imagem`)
  }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = /^(ocr|totext)$/i

export default handler
