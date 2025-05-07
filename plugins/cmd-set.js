let handler = async (m, { conn, text, usedPrefix, command }) => {
    db.data.sticker = db.data.sticker || {}

    if (!m.quoted) throw `Responda a um sticker com o comando *${usedPrefix + command}*`
    if (!m.quoted.fileSha256) throw 'Hash SHA256 ausente'
    if (!text) throw `Uso:\n${usedPrefix + command} <texto>\n\nExemplo:\n${usedPrefix + command} teste`

    let sticker = db.data.sticker
    let hash = m.quoted.fileSha256.toString('base64')

    if (sticker[hash] && sticker[hash].locked) throw 'Você não tem permissão para alterar este comando de sticker'

    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: +new Date,
        locked: false,
    }

    m.reply(`Comando definido com sucesso!`)
}

handler.help = ['cmd'].map(v => 'set' + v + ' <texto>')
handler.tags = ['database', 'premium']
handler.command = ['setcmd']
handler.premium = true

export default handler

