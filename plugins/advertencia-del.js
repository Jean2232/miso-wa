let handler = async (m) => {
  let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
if (!mention) throw `Marque a pessoa!`
let warn = global.db.data.users[mention].warn
if (warn > 0) {
  global.db.data.users[mention].warn -= 1
  m.reply('⚠️ *ADVERTÊNCIA -1*')
  m.reply(`O administrador removeu uma advertência sua. Agora você possui ${warn - 1} advertência(s).`, mention)
} else if (warn == 0) {
  m.reply('Este usuário não possui advertências.')
  }
}

handler.help = ['deladv @user']
handler.tags = ['group']
handler.command = /^deladv$/i

handler.group = true
handler.admin = true

export default handler
