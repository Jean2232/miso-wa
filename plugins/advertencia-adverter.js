let handler = async (m, { conn, groupMetadata }) => {
let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
if (!mention) throw `Marque a pessoa!`
if (!global.db.data.users[mention]) {
  global.db.data.users[mention] = {
    warn: 0
  }
}

let warn = global.db.data.users[mention].warn
if (warn < 2) {
    global.db.data.users[mention].warn += 1
    m.reply(`⚠️ *ADVERTÊNCIA +1*`)
    m.reply('Você recebeu uma advertência de um administrador. Total de advertências agora: *' + (warn + 1) + '*. Ao receber *3 advertências*, você será removido do grupo.', mention)
} else if (warn == 2) {
    global.db.data.users[mention].warn = 0
    m.reply('Até logo!')
    await time(5000)
    await conn.groupRemove(m.chat, [mention])
    m.reply(`Você foi removido do grupo ${groupMetadata.subject} por ter recebido 3 advertências.`, mention)

    }
}
handler.help = ['adv [@user]']
handler.tags = ['group']
handler.command = /^adv$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}