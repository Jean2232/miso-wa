import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie uma pergunta ou algo que você gostaria de planejar.\n\nExemplo:\n${usedPrefix + command} quero viajar para o Japão`

  try {
    let res = await fetch(`https://apizell.web.id/ai/copilot?text=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json.result) throw '❌ A resposta do Copilot não foi recebida.'

    let reply = `🧭 *Copilot Assistente de Planejamento*\n\n${json.result}`

    if (json.suggestions?.length) {
      reply += `\n\n💡 *Sugestões:*\n- ${json.suggestions.join('\n- ')}`
    }

    await m.reply(reply)
  } catch (e) {
    console.error('[ERRO NO COPILOT]', e)
    throw '❌ Erro ao processar sua pergunta. Tente novamente mais tarde.'
  }
}

handler.help = ['copilot <pergunta>']
handler.tags = ['ai']
handler.command = /^copilot$/i

export default handler
