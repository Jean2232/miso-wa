let handler = m => m
handler.before = m => {
  let user = global.db.data.users[m.sender]
  if (user.afk > -1) {
    m.reply(`
Você parou de estar AFK${user.afkReason ? ' após ' + user.afkReason : ''}
Durante ${(new Date - user.afk).toTimeString()}
`.trim())
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]

  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || ''
    m.reply(`
Não marque essa pessoa!
Ela está AFK ${reason ? 'com a razão ' + reason : 'sem razão'}
Durante ${(new Date - afkTime).toTimeString()}
`.trim())
  }
  return true
}

export default handler
