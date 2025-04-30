let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (!isOwner) throw '❌ Apenas o dono do bot pode usar este comando.'
  
    let value = args[0]
    if (!['1', '0'].includes(value)) throw `Use corretamente:\n\n${usedPrefix}${command} 1 — para *ativar*\n${usedPrefix}${command} 0 — para *desativar*`
  
    const jid = conn.user.jid
    if (!global.db.data.settings[jid]) global.db.data.settings[jid] = {}
    global.db.data.settings[jid].ownerOnly = value === '1'
  
    await global.db.write()
  
    m.reply(`✅ Owner-only foi ${value === '1' ? '*ativado*' : '*desativado*'} com sucesso.`)
  }
  
  handler.help = ['owneronly 1', 'owneronly 0']
  handler.tags = ['owner']
  handler.command = /^owneronly$/i
  handler.rowner = true
  
  export default handler
  