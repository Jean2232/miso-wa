let handler = async (m, { conn, text }) => {
    if (!text) throw 'Quem você quer banir? Envie o número e o motivo.'
    let partes = text.split(' ')
    let numero = partes[0].replace(/[^0-9]/g, '')
    let motivo = partes.slice(1).join(' ') || ''

    let who = numero + '@s.whatsapp.net'
    let users = global.db.data.users

    if (users[who]) {
        users[who].banned = true
        users[who].banReason = motivo
        conn.reply(m.chat, `Usuário banido\n\n${motivo ? 'Motivo: ' + motivo : 'Sem motivo informado'}`, m)
    } else {
        throw 'Usuário não encontrado.'
    }
}
handler.help = ['ban']
handler.tags = ['owner']
handler.command = /^ban(user)?$/i
handler.rowner = true

export default handler
