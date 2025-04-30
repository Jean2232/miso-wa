export async function before(m) {
    if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup) return

    let user = global.db.data.users[m.sender]

    if (new Date() - user.pc < 86400000)
    await m.reply(`📮Nota: Não envie spam para o bot\nDigite *.menu* para ver o menu`)
    user.pc = new Date * 1
    }