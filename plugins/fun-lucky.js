let handler = async (m, { conn }) => {
    let sorte = Math.floor(Math.random() * 101) // 0 a 100%
    let numeros = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')

    let msg = `🎰 *Sua Sorte de Hoje:*
    
✨ Porcentagem de Sorte: *${sorte}%*
🔢 Números da Sorte: *${numeros}*

_Talvez seja um bom dia pra tentar a sorte... ou não!_`

    m.reply(msg)
}

handler.help = ['sorte']
handler.tags = ['fun']
handler.command = /^sorte$/i

export default handler
