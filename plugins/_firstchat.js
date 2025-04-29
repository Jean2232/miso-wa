import moment from 'moment-timezone'

export async function before(m) {
    if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup) return

    let user = global.db.data.users[m.sender]

    if (new Date() - user.pc < 86400000) return // tempo original: 6 horas (21600000)
    await m.reply(`
    📮Nota: Não envie spam para o bot
    ⏩Digite *.menu* para ver o menu`)
    user.pc = new Date * 1
    }

    function ucapan() {
        const time = moment.tz('America/Sao_Paulo').format('HH')
        let res = "🥱"
        if (time >= 6) {
          res = "Bom dia 🌄"
        }
        if (time >= 12) {
          res = "Boa tarde ☀️"
        }
        if (time >= 18) {
          res = "Boa Noite 🌇"
        }
        return res
      }