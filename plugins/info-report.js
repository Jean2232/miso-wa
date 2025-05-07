let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Se você encontrou uma mensagem de erro, reporte com este comando.\n\nExemplo:\n${usedPrefix + command} Boa tarde, encontrei o seguinte erro: <copie/marque a mensagem do erro>`

    if (text.length < 10) throw `O relatório é muito curto. Escreva pelo menos 10 caracteres.`
    if (text.length > 1000) throw `O relatório é muito longo. Use no máximo 1000 caracteres.`

    let teks = `*${command.toUpperCase()}!*\n\nDe: *@${m.sender.split`@`[0]}*\n\nMensagem:\n${text}\n`

    conn.reply(global.nomorown + '@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
        contextInfo: {
            mentionedJid: [m.sender]
        }
    })

    m.reply(`✅ _Mensagem enviada ao proprietário do bot. Se o conteúdo do ${command.toLowerCase()} for brincadeira, será ignorado._`)
}

handler.help = ['report', 'request'].map(v => v + ' <texto>')
handler.tags = ['info']
handler.command = /^(report|request)$/i

handler.register = true
handler.disable = false

export default handler
