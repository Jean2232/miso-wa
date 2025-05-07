let handler = async (m, { conn, text }) => {
    if (!text) throw 'Quem você quer remover os avisos?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Marque alguém!'
    let users = global.db.data.users
    users[who].warning = 0
    conn.reply(m.chat, 'Feito!', m)
}
handler.help = ['unwarn']
handler.tags = ['owner']
handler.command = /^unwarn(user)?$/i
handler.rowner = true

export default handler