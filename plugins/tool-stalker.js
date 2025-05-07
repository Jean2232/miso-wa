import moment from 'moment-timezone'
import PhoneNum from 'awesome-phonenumber'

let regionNames = new Intl.DisplayNames(['pt'], { type: 'region' })

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
	let num = m.quoted?.sender || m.mentionedJid?.[0] || text
	if (!num) throw `Exemplo: ${usedPrefix + cmd} @usuário / 55xxxxxxxxxxx`
	num = num.replace(/\D/g, '') + '@s.whatsapp.net'
	if (!(await conn.onWhatsApp(num))[0]?.exists) throw 'Usuário não encontrado no WhatsApp.'
	let img = await conn.profilePictureUrl(num, 'image').catch(_ => './src/avatar_contact.png')
	let bio = await conn.fetchStatus(num).catch(_ => { })
	let name = await conn.getName(num)
	let business = await conn.getBusinessProfile(num)
	let format = PhoneNum(`+${num.split('@')[0]}`)
	let country = regionNames.of(format.getRegionCode('international'))

	let info = `\t\t\t\t*▾ WHATSAPP ▾*\n\n*° País:* ${country?.toUpperCase() || '-'}\n*° Nome:* ${name || '-'}\n*° Número formatado:* ${format.getNumber('international')}\n*° Link direto:* wa.me/${num.split('@')[0]}\n*° Menção:* @${num.split('@')[0]}\n*° Status:* ${bio?.status || '-'}\n*° Atualizado em:* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('pt-br').format('LL') : '-'}`

	if (business) {
		info += `\n\n\t\t\t\t*▾ CONTA COMERCIAL ▾*\n\n`
		info += `*° ID do negócio:* ${business.wid}\n`
		info += `*° Site:* ${business.website || '-'}\n`
		info += `*° Email:* ${business.email || '-'}\n`
		info += `*° Categoria:* ${business.category || '-'}\n`
		info += `*° Endereço:* ${business.address || '-'}\n`
		info += `*° Fuso horário:* ${business.business_hours?.timezone || '-'}\n`
		info += `*° Descrição:* ${business.description || '-'}`
	} else {
		info += `\n\n*Conta Pessoal do WhatsApp*`
	}

	img
		? await conn.sendMessage(m.chat, { image: { url: img }, caption: info, mentions: [num] }, { quoted: m })
		: m.reply(info)
}

handler.help = ['wastalk']
handler.tags = ['stalk']
handler.command = /^(wa|whatsapp)stalk$/i

handler.register = true

export default handler
