import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, participants }) => {
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
     let user = m.mentionedJid && m.mentionedJid[0]
            await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        
    m.reply('Succes')

}
handler.help = ['rebaixar @admin']
handler.tags = ['group']
handler.command = /^(rebaixar)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler