import { generateSlotSpinGif } from '../lib/roulette.js'

let handler = async (m, { conn }) => {
  const availableSymbols = ['🍒', '🍋', '🍉', '⭐', '💎']
  const emojis = []

  for (let i = 0; i < 3; i++) {
    const rand = availableSymbols[Math.floor(Math.random() * availableSymbols.length)]
    emojis.push(rand)
  }

  try {
    const gifBuffer = await generateSlotSpinGif(emojis)

    await conn.sendMessage(m.chat, {
      document: gifBuffer,
      mimetype: 'image/gif',
      fileName: 'roleta.gif',
      caption: `🎰 Resultado da Roleta: ${emojis.join(' ')}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Erro ao gerar a roleta.')
  }
}

handler.help = ['roleta']
handler.tags = ['fun']
handler.command = /^roleta$/i

export default handler
