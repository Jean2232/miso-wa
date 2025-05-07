import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Insira um nome de usuário válido!'
    let username = text.trim()

    m.reply('Aguarde...')

    try {
        const { data } = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/instagram?username=${username}`)

        let caption = `
Nome: ${data.name}
Usuário: ${data.username}
Bio: ${data.bio}
Seguidores: ${data.followers}
Seguindo: ${data.following}
Publicações: ${data.posts}
Avatar: ${data.avatar}
        `.trim()

        await conn.sendMessage(m.chat, { image: { url: data.avatar }, caption }, { quoted: m })
    } catch (err) {
        m.reply('Erro: ' + err.message)
    }
}

handler.help = ['igstalk']
handler.tags = ['stalk']
handler.command = /^(igstalk|instagramstalk)$/i

handler.register = true
handler.limit = true

export default handler
