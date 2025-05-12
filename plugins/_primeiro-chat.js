import moment from 'moment-timezone'

export async function before(m) {
    if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup) return

    let user = global.db.data.users[m.sender]

    if (new Date() - user.pc < 86400000) return // tempo original era 21600000 (6 horas)
    await m.reply(`
📮 Nota: Por favor, não faça spam com o bot
⏩ Digite *.menu* para exibir o menu
`)
    user.pc = new Date * 1
}

function saudacao() {
    const time = moment.tz('America/Sao_Paulo').format('HH')
    let res = "Boa madrugada 🌆"
    if (time >= 4) {
        res = "Bom dia 🌄"
    }
    if (time > 10) {
        res = "Boa tarde ☀️"
    }
    if (time >= 15) {
        res = "Boa tarde 🌇"
    }
    if (time >= 18) {
        res = "Boa noite 🌙"
    }
    return res
}
