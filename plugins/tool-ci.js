let handler = async (m, { conn }) => {
    if (!m.quoted) throw '❌ Responda a mensagem do canal para identificar.'
    try {
        let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
        await m.reply(`📡 *Informações do Canal*\n\n📛 Nome: ${id.newsletterName}\n🆔 ID: ${id.newsletterJid}`)
    } catch (e) {
        throw '❌ A mensagem precisa ser encaminhada de um canal.'
    }
}

handler.help = handler.command = ['ci']
handler.tags = ['tools']
handler.register = true

export default handler
