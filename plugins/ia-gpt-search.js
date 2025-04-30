import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `❌ Envie sua pergunta ou termo de pesquisa.\n\nExemplo:\n${usedPrefix + command} últimas notícias sobre IA`

  try {
    const res = await fetch(`https://apizell.web.id/ai/gptsearch?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.result) throw '❌ A IA não retornou uma resposta válida.'

    await m.reply(`🌐 *GPT Search*\n\n${json.result}`)
  } catch (e) {
    console.error('[ERRO NO GPTSEARCH]', e)
    throw '❌ Erro ao buscar resposta com o GPT Search.'
  }
}

handler.help = ['gptsearch <pesquisa>']
handler.tags = ['ai']
handler.command = /^gptsearch$/i

export default handler
