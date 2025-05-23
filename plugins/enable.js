let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let type = (args[0] || '').toLowerCase()
  let isAll = false
  let isUser = false
  switch (type) {
    case 'antifake':
      if (!m.isGroup) {
        global.dfail('group', m, conn)
        throw false
      }
      if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }

      if (!Array.isArray(chat.allowed_ddi)) chat.allowed_ddi = ['55']

      if (args[1] === '-add' && args[2]) {
        let novos = args.slice(2).join(' ').split(',').map(d => d.trim().replace('+', ''))
        chat.allowed_ddi.push(...novos)
        chat.allowed_ddi = [...new Set(chat.allowed_ddi)]
        m.reply(`✅ *DDIs permitidos atualizados:*\n${chat.allowed_ddi.join(', ')}`)
      } else if (args[1] === '-remove' && args[2]) {
        let remover = args.slice(2).join(' ').split(',').map(d => d.trim().replace('+', ''))
        chat.allowed_ddi = chat.allowed_ddi.filter(d => !remover.includes(d))
        m.reply(`🗑️ *DDIs após remoção:*\n${chat.allowed_ddi.join(', ')}`)
      } else {
        chat.antifake = isEnable
        m.reply(`🛡️ *Antifake ${isEnable ? 'ativado' : 'desativado'}* neste grupo.`)
      }
      break;

    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = !isEnable
      break
    case 'autobio':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoBio = isEnable
      break
    case 'autobio':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoBio = !isEnable
      break
    case 'autodelvn':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autodelvn = isEnable
      break
    case 'document':
      chat.useDocument = isEnable
      break
    case 'public':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
    case 'antisticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker = isEnable
      break
    case 'autosticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoSticker = isEnable;
      break
    case 'toxic':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = !isEnable
      break
    case 'antibadword':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBadword = isEnable
      break
    case 'antibadword':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBadword = !isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'mycontact':
    case 'mycontacts':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break
    case 'restrict':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['restrict'] = isEnable
      break
    case 'nyimak':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['nyimak'] = isEnable
      break
    case 'autoread':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      break
    case 'pconly':
    case 'privateonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['pconly'] = isEnable
      break
    case 'owneronly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['owneronly'] = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['gconly'] = isEnable
      break
    case 'self':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = isEnable
      break
    case 'swonly':
    case 'statusonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['swonly'] = isEnable
      break
    case 'viewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
    case 'nsfw':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break
    case 'menu':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.menu = isEnable
      break
    case 'simi':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.simi = isEnable
      break
    case 'autogpt':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autogpt = isEnable
      break
    default:
      if (!/[01]/.test(command)) return m.reply(`
Lista de opções:
| antibadword
| antidelete
| antilink
| antisticker
| autobio
| autobio
| autogpt
| autolevelup
| autoread
| autosticker
| delete
| detect
| document
| gconly
| menu
| nsfw
| nyimak
| owneronly
| pconly
| public
| self
| simi
| swonly
| whitelistmycontacts
| welcome

Exemplo:
${usedPrefix}ativar welcome
${usedPrefix}desativar welcome
`.trim())
      throw false
  }
  m.reply(`
    *${type}* foi *${isEnable ? 'ativado' : 'desativado'}* ${isAll ? 'para todo o bot' : isUser ? '' : 'para este chat'}
    `.trim())
    }
    
handler.help = ['enable <opção>', 'disable <opção>', 'ativar <opção>', 'desativar <opção>']
handler.tags = ['group', 'owner']
handler.command = /^(ativar|desativar|(en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i
    
export default handler