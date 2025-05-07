import { translate } from '@vitalets/google-translate-api'

var handler = async (m, { args, usedPrefix, command }) => {
	let lang, text
	if (args.length >= 2) {
		lang = args[0] ? args[0] : 'id', text = args.slice(1).join(' ')
	} else if (m.quoted && m.quoted.text) {
		lang = args[0] ? args[0] : 'id', text = m.quoted.text
	} else throw `Ex: ${usedPrefix + command} pt olá eu sou um robô`
	let res = await translate(text, { to: lang }).catch(_ => null)
	if (!res) throw `Erro: O idioma "${lang}" não é suportado`
	m.reply(`*Idioma Detectado:* ${res.raw.src}\n*Traduzido Para:* ${lang}\n\n*Texto Original:* ${res.raw.sentences[0].orig}\n*Tradução:* ${res.raw.sentences[0].trans}`.trim())
}

handler.help = ['translate'].map(v => v + ' <idioma> <texto>')
handler.tags = ['ferramentas']
handler.command = /^(tr(anslate)?)$/i

handler.register = true

export default handler
