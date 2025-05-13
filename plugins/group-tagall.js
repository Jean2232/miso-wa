import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, participants }) => {
  const users = participants
    .map(u => u.id)
    .filter(v => v && v !== conn.user.jid)

  if (text || m.quoted?.text) {
    const mensagem = `📢 *Tag All*\n\n🗒️ ${text ? text : m.quoted?.text}\n\n` +
      users.map(v => `➤ @${v.replace(/@.+/, '')}`).join('\n')

    await m.reply(mensagem, null, { mentions: users })

    // Reconstrói e reenvia a mensagem com menções reais (para notificar)
    const quoted = m.quoted || m
    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [quoted.mtype || 'extendedTextMessage']: quoted.toJSON ? quoted.toJSON() : {
            text: quoted.text || ''
          }
        },
        {
          quoted: m,
          userJid: conn.user.jid
        }
      ),
      text || quoted.text,
      conn.user.jid,
      { mentions: users }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } else {
    m.reply('❗️Responda uma mensagem ou digite o texto que deseja enviar ao mencionar todos.')
  }
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall']
handler.admin = true
handler.group = true

export default handler
