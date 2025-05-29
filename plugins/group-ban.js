import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants, isAdmin }) => {

    if (!isAdmin) {

        return m.reply('❌ Este comando só pode ser usado por *administradores* do grupo.')

    }

    let users = m.mentionedJid.length 

        ? m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))

        : m.quoted ? [m.quoted.sender] 

        : []

    if (users.length === 0) {

        return m.reply('❌ Marque um usuário ou responda uma mensagem de quem deseja remover.')

    }

    for (let user of users) {

        const membro = participants.find(v => areJidsSameUser(v.id, user)) || {}

        if (user.endsWith('@s.whatsapp.net') && !membro.admin) {

            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

            await delay(1000) // Pequeno delay para evitar flood

        }

    }

}

handler.help = ['ban @usuario ou (responder mensagem)']

handler.tags = ['group']

handler.command = 'ban'


handler.owner = false

handler.group = true

handler.botAdmin = true

handler.admin = true

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default handler