import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie uma pergunta.\n\nExemplo:\n${usedPrefix + command} como funciona um satélite?`

  try {
    const res = await fetch(`https://apizell.web.id/ai/gemma29bit?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.result) throw '❌ A resposta da IA não foi recebida.'

    await m.reply(`🧠 *Gemma 2 (9B-IT)*\n\n${json.result}`)
  } catch (e) {
    console.error('[ERRO NO GEMMA]', e)
    throw '❌ Erro ao processar a resposta da IA. Tente novamente mais tarde.'
  }
}

handler.help = ['gemma <pergunta>']
handler.tags = ['ai']
handler.command = /^gemma$/i

export default handler
