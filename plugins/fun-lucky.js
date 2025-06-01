import fs from 'fs'

let file = '../tmp/sorte.json'
let sorteData = {}

if (fs.existsSync(file)) {
    sorteData = JSON.parse(fs.readFileSync(file))
}

let handler = async (m, { conn }) => {
    const user = m.sender

    const now = Date.now()
    const data = sorteData[user]

    if (data && now - data.timestamp < 86400000) {
        let restante = clockString(86400000 - (now - data.timestamp))
        return m.reply(`⚠️ Você já usou sua sorte hoje!\n\n⏳ Tente novamente em: *${restante}*`)
    }

    let sorte = Math.floor(Math.random() * 101)
    let numeros = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')

    sorteData[user] = {
        sorte,
        numeros,
        timestamp: now
    }

    fs.writeFileSync(file, JSON.stringify(sorteData))

    let msg = `🎰 *Sua Sorte de Hoje:*
    
✨ Porcentagem de Sorte: *${sorte}%*
🔢 Números da Sorte: *${numeros}*

_Talvez seja um bom dia pra tentar a sorte... ou não!_`

    m.reply(msg)
}

handler.help = ['sorte']
handler.tags = ['diversão', 'fun']
handler.command = /^sorte$/i

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
