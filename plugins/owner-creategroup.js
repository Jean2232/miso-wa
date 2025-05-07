let handler = async (m, { conn, text }) => {
   if (!text) return m.reply('_Digite o nome do grupo!_')
   try {
    m.reply(wait)
    let group = await conn.groupCreate(text, [m.sender])
    let link = await conn.groupInviteCode(group.gid)
    let url = 'https://chat.whatsapp.com/' + link;
    m.reply('_Grupo criado com sucesso *' + text + '*_

*Nome:* ' + text + '
*ID:* ' + group.gid + '
*Link:* ' + url)
   } catch (e) {
    m.reply(`Erro`)
  }
}
handler.help = ['creategroup']
handler.tags = ['owner']
handler.command = /^((create|buat)(gc|grup|group))$/
handler.owner = true
handler.premium = false
export default handler
