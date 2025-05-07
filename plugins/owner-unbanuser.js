let handler = async (m, { conn, text }) => {
    if (!text) throw 'Quem você deseja desbanir? Forneça o número do usuário.'
    let who
    if (m.isGroup) {
        if (!m.mentionedJid) throw 'Nenhum usuário mencionado para desbanir.'
        who = m.mentionedJid[0]
    } else {
        let phoneNumber = text.replace(/[^0-9]/g, '')
        who = phoneNumber + '@s.whatsapp.net'
    }
    let users = global.db.data.users
    if (users[who]) {
        users[who].banned = false
        users[who].banReason = ''
        conn.reply(m.chat, 'Feito!', m)
    } else {
        throw 'Usuário não encontrado.'
    }
}
handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban(user)?$/i
handler.rowner = true

export default handler