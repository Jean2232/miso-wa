let handler = async (m, { participants }) => {
    global.db.data.chats[m.chat].isBanned = true
    m.reply('Chat banido com sucesso! Não funcionarei mais neste grupo')
}
handler.help = ['banchat', 'bnc']
handler.tags = ['owner']
handler.command = /^(banchat|bnc)$/i
handler.description = 'Comando útil para o bot não funcionar no grupo em que foi usado. Para reverter, utilize *unbanchat*'
handler.owner = true

export default handler
