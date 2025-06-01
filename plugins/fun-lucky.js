let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender]
    const now = Date.now()

    if (!user.luck) {
        user.luck = {
            timestamp: 0,
            percent: 0,
            numbers: ''
        }
    }

    const tempoRestante = 86400000 - (now - user.luck.timestamp)

    if (tempoRestante > 0) {
        const restante = clockString(tempoRestante)
        return m.reply(`⚠️ Você já pegou sua sorte hoje!\n
✨ *Sorte de Hoje:* *${user.luck.percent}%*
🔢 *Números da Sorte:* *${user.luck.numbers}*

⏳ Tente novamente em *${restante}*.`)
    }

    const sorte = Math.floor(Math.random() * 101) // 0 a 100%
    const numeros = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')

    user.luck.timestamp = now
    user.luck.percent = sorte
    user.luck.numbers = numeros

    let msg = `🎰 *Sua Nova Sorte de Hoje:*\n
✨ Porcentagem de Sorte: *${sorte}%*
🔢 Números da Sorte: *${numeros}*

_Tente sua sorte novamente amanhã!_`

    m.reply(msg)
}

handler.help = ['sorte']
handler.tags = ['fun']
handler.command = /^sorte$/i

export default handler


function clockString(ms) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor(ms / 60000) % 60
    const s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
