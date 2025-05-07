let handler = async (m, { conn, text }) => {
    if (!text) throw `Insira o texto para a nova bio do bot`
    try {
        await conn.updateProfileStatus(text).catch(_ => _)
        conn.reply(m.chat, 'Bio do bot atualizada com sucesso!', m)
    } catch {
        throw 'Ocorreu um erro... :D'
    }
}
handler.help = ['setbio']
handler.tags = ['owner']
handler.command = /^(setbio)$/i
handler.owner = true

export default handler