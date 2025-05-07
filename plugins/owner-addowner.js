let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
    } else {
        who = m.chat
    }

    if (!who) throw `Marque a pessoa!`
    if (global.owner.includes(who.split`@`[0])) throw 'Essa pessoa já é um owner!'

    global.owner.push(`${who.split`@`[0]}`)
    conn.reply(m.chat, `@${who.split`@`[0]} agora é um owner!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
}

handler.help = ['addowner [@usuario]']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)owner$/i

handler.owner = true

export default handler
