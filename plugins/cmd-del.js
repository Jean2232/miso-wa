let handler = async (m, { conn, usedPrefix, text, command }) => {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
    if (!hash) throw `Sem hash`
    let sticker = global.db.data.sticker
    if (sticker[hash] && sticker[hash].locked) throw 'Você não tem permissão para excluir este comando de sticker.'
    delete sticker[hash]
    m.reply(`Berhasil!`)
}


handler.help = ['cmd'].map(v => 'del' + v + ' <texto>')
handler.tags = ['database', 'premium']
handler.command = ['delcmd']

handler.register = true
handler.premium = true

export default handler
