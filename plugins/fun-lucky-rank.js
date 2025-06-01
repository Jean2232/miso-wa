let handler = async (m, { conn }) => {
    const users = global.db.data.users
    const now = Date.now()

    const sorteDoDia = Object.entries(users)
        .filter(([_, data]) => data.luck && (now - data.luck.timestamp) < 86400000)
        .map(([jid, data]) => ({
            jid,
            name: data.name || jid.split('@')[0],
            percent: data.luck.percent,
            numbers: data.luck.numbers
        }))
        .sort((a, b) => b.percent - a.percent)

    if (sorteDoDia.length === 0) {
        return m.reply('❌ Ninguém testou a sorte nas últimas 24 horas.')
    }

    const ranking = sorteDoDia.map((u, i) => 
        `${i + 1}º 🏅 *${u.name}*\n✨ *${u.percent}%* de sorte\n🔢 Números: *${u.numbers}*\n`
    ).join('\n')

    const texto = `🏆 *Ranking dos Mais Sortudos de Hoje:*\n\n${ranking}\n⏳ _Reseta a cada 24 horas desde a primeira sorte de cada usuário._`

    m.reply(texto)
}

handler.help = ['ranksorte']
handler.tags = ['fun']
handler.command = /^ranksorte$/i

export default handler
