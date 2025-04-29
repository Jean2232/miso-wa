import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!text) throw '❌ Use o formato: .brat2 seu texto -tema green';

  // Extrai texto e tema
  let temaMatch = text.match(/-tema\s+(white|black|green|blue|strike)/i)
  let tema = temaMatch ? temaMatch[1].toLowerCase() : null
  let conteudo = text.replace(/-tema\s+(white|black|green|blue|strike)/i, '').trim()

  if (!conteudo) throw '❌ Texto não encontrado. Envie algo como: .brat2 Olá mundo -tema black'
  if (!tema) throw '❌ Tema não reconhecido. Use: white, black, green, blue ou strike'

  try {
    let url = `https://api.nekorinn.my.id/maker/brat?text=${encodeURIComponent(conteudo)}&theme=${tema}`

    let res = await fetch(url)
    if (!res.ok) throw `🚫 Erro ao acessar API. Código: ${res.status}`

    let buffer = await res.buffer()

    let stiker = await sticker(buffer, null, global.stickpack, global.stickauth)
    await conn.sendFile(m.chat, stiker, null, { asSticker: true }, m)

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: `❌ Erro ao gerar figurinha:\n${e.message || 'Erro desconhecido.'}`
    }, { quoted: m })
  }
}

handler.help = ['brat2 <texto> -tema <tema>']
handler.tags = ['sticker']
handler.command = /^brat2$/i
handler.register = true

export default handler
