import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Insira um UID válido do Genshin!'
    let userId = text.trim()

    m.reply('Aguarde...')

    try {
        const { data } = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/genshin?userId=${userId}`)

        if (!data.status || !data.data) throw 'Dados não encontrados!'

        let result = data.data

        let caption = `
*====== [Perfil Genshin] ======*
• Apelido: ${result.nickname}
• Nível: ${result.level}
• Nível Mundial: ${result.world_level}
• Conquistas: ${result.achievement}
• ID do Cartão: ${result.card_id}
• Abismo em Espiral: ${result.spiral_abyss}
• UID: ${result.uid}
• Detalhes: ${result.detail}
        `.trim()

        await conn.sendMessage(m.chat, { image: { url: result.screenshot }, caption }, { quoted: m })
    } catch (err) {
        m.reply('Erro: ' + err.message)
    }
}

handler.help = ['gistalk']
handler.tags = ['stalk']
handler.command = /^(genshinstalk|gistalk)$/i

handler.register = true
handler.limit = true

export default handler
