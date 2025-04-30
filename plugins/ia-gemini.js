import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie uma pergunta.\n\nExemplo:\n${usedPrefix + command} me explique a teoria das cordas.`

  try {
    const res = await fetch(`https://apizell.web.id/ai/gemini25proexp0325?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.result) throw '❌ A IA não respondeu corretamente.'

    await m.reply(`🔮 *Gemini 1.5 Pro*\n\n${json.result}`)
  } catch (e) {
    console.error('[ERRO NO GEMINI]', e)
    throw '❌ Erro ao obter resposta da IA Gemini. Tente novamente.'
  }
}

handler.help = ['gemini <pergunta>']
handler.tags = ['ai']
handler.command = /^gemini$/i

export default handler
