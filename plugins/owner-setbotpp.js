let handler = async (m, { conn, args }) => {
    let bot = conn.user.jid
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
        let img = await q.download()
        if (!img) throw `Não encontrei a foto *┰ω┰*`
        conn.updateProfilePicture(bot, img)
        conn.reply(m.chat, 'Foto de perfil do bot atualizada com sucesso! *>ω<*!', m)
    }
}
handler.help = ['setbotpp']
handler.tags = ['owner']
handler.command = /^(setbotpp)$/i
handler.owner = true

export default handler