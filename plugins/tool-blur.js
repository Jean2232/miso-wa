import jimp from 'jimp'

let handler = async (m, { conn, text }) => {
	let image = m.message?.imageMessage
		? await m.download()
		: /image/.test(m.quoted?.mediaType)
		? await m.quoted.download()
		: m.mentionedJid?.[0]
		? await conn.profilePictureUrl(m.mentionedJid[0], 'image')
		: await conn.profilePictureUrl(m.quoted?.sender || m.sender, 'image')

	if (!image) throw `❌ Não foi possível obter a imagem`

	let nivel = text || '5'
	let img = await jimp.read(image)
	img.blur(isNaN(nivel) ? 5 : parseInt(nivel))

	img.getBuffer('image/jpeg', (err, buffer) => {
		if (err) throw err?.message || `❌ Erro ao aplicar desfoque na imagem`
		m.reply(buffer)
	})
}

handler.help = ['blur']
handler.tags = ['tools']
handler.command = /^blur$/i
handler.register = true

export default handler
