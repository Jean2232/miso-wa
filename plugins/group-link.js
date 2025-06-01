import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, args }) => {
    let group = m.chat
    if (/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(args[0])) group = args[0]
    if (!/^[0-9]{5,16}-?[0-9]+@g\.us$/.test(group)) throw 'Este comando só pode ser usado em grupos!'
    let groupMetadata = await conn.groupMetadata(group)
    if (!groupMetadata) throw 'Os metadados do grupos estão indefinidos...'
    if (!('participants' in groupMetadata)) throw 'Os participantes estão indefinidos...'
    let me = groupMetadata.participants.find(user => areJidsSameUser(user.id, conn.user.id))
    if (!me) throw 'Eu não estou neste grupo.'
    if (!me.admin) throw 'Eu não sou um administrador.'
    m.reply('https://chat.whatsapp.com/' + await conn.groupInviteCode(group))
}
handler.help = ['link']
handler.tags = ['group']
handler.command = /^link(gp)?$/i


export default handler