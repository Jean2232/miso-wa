let handler = async (m, { conn, usedPrefix }) => {
    let warning = global.db.data.users[m.sender].warning

    let msg = `
*Você possui ${warning} advertência(s).*
    `.trim()

    conn.reply(m.chat, msg, m)
}

handler.help = ['advertencias']
handler.tags = ['info']
handler.command = /^(advertencias)$/i

handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
