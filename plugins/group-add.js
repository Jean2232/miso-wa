const {
	getBinaryNodeChild,
	getBinaryNodeChildren
} = (await import('@adiwajshing/baileys')).default

import fetch from 'node-fetch'

let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
	if (!text) throw `❌ Informe pelo menos um número!\nExemplo:\n\n${usedPrefix + command} ${global.owner[0]}`
	m.reply('⏳ Processando solicitação...')

	const _participants = participants.map(user => user.id)

	const users = (await Promise.all(
		text.split(',')
			.map(v => v.replace(/[^0-9]/g, ''))
			.filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
			.map(async v => [
				v,
				await conn.onWhatsApp(v + '@s.whatsapp.net')
			])
	)).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us')

	const response = await conn.query({
		tag: 'iq',
		attrs: {
			type: 'set',
			xmlns: 'w:g2',
			to: m.chat,
		},
		content: users.map(jid => ({
			tag: 'add',
			attrs: {},
			content: [{ tag: 'participant', attrs: { jid } }]
		}))
	})

	const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null)
	const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0)

	const participant = getBinaryNodeChildren(response, 'add')
	let resultado = participant[0].content.filter(v => v)

	if (resultado[0]?.attrs?.error == 408) {
		const jid = resultado[0].attrs.jid
		conn.reply(m.chat, `❌ Não foi possível adicionar @${jid.split('@')[0]}!\nEsse número pode ter saído ou sido removido recentemente.`, m)
	}

	for (const user of participant[0].content.filter(item => item.attrs.error == 403)) {
		const jid = user.attrs.jid
		const content = getBinaryNodeChild(user, 'add_request')
		const invite_code = content.attrs.code
		const invite_code_exp = content.attrs.expiration
		const txt = `🔗 Enviando convite para @${jid.split('@')[0]}...`
		await m.reply(txt, null, { mentions: await conn.parseMention(txt) })

		await conn.sendGroupV4Invite(
			m.chat,
			jid,
			invite_code,
			invite_code_exp,
			await conn.getName(m.chat),
			'Convite para entrar no grupo do WhatsApp',
			jpegThumbnail
		)
	}
}

handler.help = ['add', '+'].map(v => v + ' @usuario ou número')
handler.tags = ['group']
handler.command = /^(add|\+)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true
handler.fail = null

export default handler
