let handler = async (m, { conn, args, usedPrefix, command }) => {
    let isClose = { // Switch Case Like :v
        'open': 'not_announcement',
        'close': 'announcement',
    }[(args[0] || '')]
    if (isClose === undefined)
        throw `
*Formato Incorreto!!!:*
  *${usedPrefix + command} abrir*
  *${usedPrefix + command} fechar*
`.trim()
    await conn.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['gp *abrir / fechar*']
handler.tags = ['group']
handler.command = /^(group|gp)$/i

handler.admin = true
handler.botAdmin = true

export default handler
