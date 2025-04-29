
let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat]
  if (!Array.isArray(chat.allowed_ddi)) chat.allowed_ddi = ['55']

  if (!m.isGroup) throw 'Este comando só pode ser usado em grupos!'
  if (!(isAdmin || isOwner)) throw 'Você precisa ser admin para usar isso!'

  switch (args[0]) {
    case '-add':
      if (!args[1]) throw 'Informe os DDIs que deseja permitir. Ex: -add 55,351'
      let novos = args.slice(1).join(' ').split(',').map(d => d.trim().replace('+', ''))
      chat.allowed_ddi.push(...novos)
      chat.allowed_ddi = [...new Set(chat.allowed_ddi)]
      m.reply(`✅ *DDIs permitidos atualizados:*\n${chat.allowed_ddi.join(', ')}`)
      break

    case '-remove':
      if (!args[1]) throw 'Informe os DDIs que deseja remover. Ex: -remove 1,44'
      let remover = args.slice(1).join(' ').split(',').map(d => d.trim().replace('+', ''))
      chat.allowed_ddi = chat.allowed_ddi.filter(d => !remover.includes(d))
      m.reply(`🗑️ *DDIs após remoção:*\n${chat.allowed_ddi.join(', ')}`)
      break

    case '-list':
      m.reply(`📋 *DDIs permitidos neste grupo:*\n${chat.allowed_ddi.join(', ')}`)
      break

    default:
      throw `Uso correto:
${usedPrefix}antifake -add 55,351
${usedPrefix}antifake -remove 1
${usedPrefix}antifake -list`
  }
}

handler.help = ['antifake -add <ddi,...>', 'antifake -remove <ddi,...>', 'antifake -list']
handler.tags = ['group']
handler.command = /^antifake$/i

export default handler
