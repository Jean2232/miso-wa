import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let chats = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text

  conn.reply(m.chat, `_Enviando mensagem de broadcast para ${chats.length} chats..._`, m)

  for (let id of chats) {
    await conn.copyNForward(
      id,
      conn.cMod(
        m.chat,
        cc,
        /bc|broadcast/i.test(teks)
          ? `${htki} *BROADCAST* ${htka}\n` + teks
          : `${htki} *BROADCAST* ${htka}\n` + teks + '\n' + readMore + '\n\n' + botdate
      ),
      true
    ).catch(_ => _)
  }

  m.reply('✅ Broadcast enviado para todos os chats!')
}

handler.help = ['broadcast', 'bc'].map(v => v + ' <texto>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)$/i

handler.owner = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length)
