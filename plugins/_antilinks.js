let linkRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9\-]+\.[a-z]{2,}(?:\/\S*)?/i

let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  const isGroup = m.chat.endsWith('@g.us')
  if (!isGroup) return true
  if (!m.text || typeof m.text !== 'string') return true
  if (m.fromMe || m.isBaileys) return true

  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.antiLink) return true

  if (linkRegex.test(m.text) && !isAdmin) {
    let groupLink = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
    if (m.text.includes(groupLink)) return true

    if (!isBotAdmin) {
      return m.reply('🚫 *Antilink ativado*, mas não posso remover membros porque não sou admin.')
    }

    await m.reply('🚫 *Link detectado!*\nVocê será removido.')
    await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.id,
        participant: m.sender
      }
    })
  }

  return true
}

export default handler
