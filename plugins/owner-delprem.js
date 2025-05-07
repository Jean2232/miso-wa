let handler = async (m, { conn, text }) => {
    if (!text) throw 'Número?'
    let who
    if (m.isGroup) {
        if (!m.mentionedJid) throw 'Nenhum usuário mencionado para remover premium.'
        who = m.mentionedJid[0]
    } else {
        let phoneNumber = text.replace(/[^0-9]/g, '')
        who = phoneNumber + '@s.whatsapp.net'
    }
    let users = global.db.data.users
    if (users[who]) {
        users[who].premium = false
        users[who].premiumTime = 0
        conn.reply(m.chat, 'Feito!', m)
    } else {
        throw 'Usuário não encontrado.'
    }
}
handler.help = ['delprem']
handler.tags = ['owner']
handler.command = /^delprem(user)?$/i
handler.rowner = true
export default handler
