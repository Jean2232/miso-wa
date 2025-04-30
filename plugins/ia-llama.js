import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie uma pergunta.\n\nExemplo:\n${usedPrefix + command} como é o clima em Marte?`

  try {
    const res = await fetch(`https://apizell.web.id/ai/llama38b8192?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.result) throw '❌ A IA não retornou nenhuma resposta.'

    await m.reply(`🦙 *LLaMA 3 (8B)*\n\n${json.result}`)
  } catch (e) {
    console.error('[ERRO NO LLAMA]', e)
    throw '❌ Erro ao obter a resposta da IA. Tente novamente.'
  }
}

handler.help = ['llama <pergunta>']
handler.tags = ['ai']
handler.command = /^llama$/i

export default handler
