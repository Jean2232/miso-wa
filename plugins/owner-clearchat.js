let handler = async (m, { conn, args }) => {
  try {
      if (!args[0]) throw 'Informe o JID da pessoa ou grupo.'
      const jid = args[0]
      await conn.chatModify({
          delete: true,
          lastMessages: [{
              key: m.key,
              messageTimestamp: m.messageTimestamp
          }]
      }, jid)
      conn.reply(m.chat, `Chat deletado com sucesso para ${jid}`, m)
  } catch (error) {
      console.error(error)
      conn.reply(m.chat, 'Ocorreu um erro ao tentar apagar o chat. Verifique se o JID está correto.', m)
  }
}

handler.help = ['clearchat']
handler.tags = ['owner']
handler.owner = true
handler.command = /^(clearchat)$/i

export default handler
