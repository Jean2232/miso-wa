import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie uma pergunta.\n\nExemplo:\n${usedPrefix + command} O que é inteligência artificial?`

  try {
    let res = await fetch(`https://apizell.web.id/ai/blackbox?text=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json.result) throw '❌ A resposta da IA não foi recebida.'

    await m.reply(`🤖 *Blackbox*\n\n${json.result}`)
  } catch (e) {
    console.error('[ERRO NO BLACKBOX]', e)
    throw '❌ Erro ao processar sua pergunta. Tente novamente mais tarde.'
  }
}

handler.help = ['blackbox <pergunta>']
handler.tags = ['ai']
handler.command = /^blackbox$/i

export default handler
