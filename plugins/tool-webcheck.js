import https from 'https'
import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {
	if (!args[0]) throw `Ex: ${usedPrefix + command} dark-hosting.com`
	let res = await checkWeb(args)
	m.reply(res.map(v => `*• Domínio:* ${v.Domain}\n*• Status:* ${v.Status}`).join('\n\n'))
}
handler.command = /^web(check|cek)|(check|cek)web$/i

handler.register = true
handler.limit = true

export default handler

async function checkWeb(url) {
	let res = await (await fetch('https://trustpositif.kominfo.go.id/Rest_server/getrecordsname_home', {
		agent: new https.Agent({ rejectUnauthorized: false }),
		method: 'post',
		body: new URLSearchParams(Object.entries({ name: url.join('%0A') }))
	})).json()
	return res.values
}
