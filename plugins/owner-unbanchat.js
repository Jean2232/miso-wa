let handler = async (m) => {
    global.db.data.chats[m.chat].isBanned = false
    m.reply('Chat desbanido! Voltarei a funcionar no grupo.')
}
handler.help = ['unbanchat', 'ubnc']
handler.tags = ['owner']
handler.command = /^(unbanchat|ubnc)$/i
handler.description = 'Comando útil para o bot voltar a funcionar em um grupo que foi banido. Reverte a ação do *banchat*'
handler.owner = true

export default handler