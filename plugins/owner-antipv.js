let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (!isOwner) throw '❌ Apenas o dono do bot pode usar este comando.'
  
    let value = args[0]
    if (!['1', '0'].includes(value)) throw `Use corretamente:\n\n${usedPrefix}${command} 1 — para *ativar* o bloqueio de mensagens no privado\n${usedPrefix}${command} 0 — para *desativar* o bloqueio`
  
    let settings = global.db.data.settings[conn.user.jid]
    settings.blockPrivate = value === '1'
  
    m.reply(`✅ AntiPV foi ${value === '1' ? '*ativado*' : '*desativado*'} com sucesso.`)
  }
  
  handler.help = ['antipv 1', 'antipv 0']
  handler.tags = ['owner']
  handler.command = /^antipv$/i
  handler.rowner = true
  
  export default handler
  