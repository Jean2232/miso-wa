let handler = async (m, { conn, groupMetadata }) => {
     let key = {}
 try {
 	key.remoteJid = m.quoted ? m.quoted.fakeObj.key.remoteJid : m.key.remoteJid
	key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe
	key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id
 	key.participant = m.quoted ? m.quoted.fakeObj.participant : m.key.participant
 } catch (e) {
 	console.error(e)
 }
 conn.sendMessage(m.chat, { delete: key })
  let mention = m.mentionedJid?.[0] || m.quoted?.sender
  if (!mention) throw '⚠️ Marque ou responda à mensagem de quem você deseja advertir.'

  if (!global.db.data.users[mention]) {
    global.db.data.users[mention] = { warn: 0 }
  }

  let user = global.db.data.users[mention]

  if (user.warn < 2) {
    user.warn++
    await m.reply(`⚠️ *ADVERTÊNCIA +1*\nUsuário: @${mention.split('@')[0]}\nTotal: ${user.warn}/3`, null, {
      mentions: [mention]
    })
  } else {
    user.warn = 0
    await m.reply(`❌ *Removendo @${mention.split('@')[0]} por 3 advertências.*`, null, {
      mentions: [mention]
    })

    await delay(1500)
    await conn.groupParticipantsUpdate(m.chat, [mention], 'remove')
  }
}

handler.help = ['adv [@usuário ou resposta]']
handler.tags = ['group']
handler.command = /^adv$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
