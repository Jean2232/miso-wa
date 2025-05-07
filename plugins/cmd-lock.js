let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) throw 'Responda uma mensagem!'
    if (!m.quoted.fileSha256) throw 'Hash SHA256 ausente'
    let sticker = db.data.sticker
    let hash = m.quoted.fileSha256.toString('hex')
    if (!(hash in sticker)) throw 'Hash não encontrado na base de dados'
    sticker[hash].locked = !/^un/i.test(command)
    m.reply('Feito!')
} 
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['database']
handler.command = /^(un)?lockcmd$/i

handler.premium = true

export default handler
