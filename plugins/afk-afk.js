var handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    user.afk = + new Date
    user.afkReason = text
    m.reply(`${conn.getName(m.sender)} está AFK${text ? ': ' + text : ''}`)
  }
  
  handler.help = ['afk <motivo>']
  handler.tags = ['main']
  handler.command = /^afk$/i
  
  export default handler