import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) =>
      jid.endsWith('@g.us') &&
      chat.isChats &&
      !chat.metadata?.read_only &&
      !chat.metadata?.announce
    )
    .map(v => v[0])

  let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m
  let teks = text ? text : cc.text

  conn.reply(m.chat, `_Enviando broadcast para ${groups.length} grupos..._`, m)

  for (let id of groups) {
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

  m.reply('✅ Broadcast para todos os grupos finalizado!')
}

handler.help = ['bcgp <texto>']
handler.tags = ['owner']
handler.command = /^(bcgp)$/i
handler.owner = true

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length)

export default handler
