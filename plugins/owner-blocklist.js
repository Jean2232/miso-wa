let handler = async (m, { conn, usedPrefix }) => {
	await conn.fetchBlocklist().then(async data => {
		let txt = `*「  Lista de Números Bloqueados  」*\n\n*Total:* ${data.length}\n\n┌─\n`
		for (let i of data) {
			txt += `├ @${i.split("@")[0]}\n`
		}
		txt += "└────"
		return conn.reply(m.chat, txt, m, { mentions: await conn.parseMention(txt) })
	}).catch(err => {
		console.log(err);
		throw 'Nenhum número bloqueado encontrado!'
	})
}

handler.tags = ['info']
handler.help = ['blocklist']
handler.command = /^(blocklist)$/i

handler.owner = true

export default handler
