import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Insira um nome de usuário válido!'
    let username = text.trim()

    m.reply('Aguarde...')

    try {
        let { data } = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/twitter?username=${username}`)
        if (data.message !== 'OK') throw data.message || 'Erro ao obter dados!'

        let user = data.user
        let caption = `
ID: ${user.id}
URL: ${user.url}
Usuário: ${user.screen_name}
Nome: ${user.name}
Localização: ${user.location}
Descrição: ${user.description}
Seguidores: ${user.followers}
Seguindo: ${user.following}
Curtidas: ${user.likes}
Banner: ${user.banner_url}
Avatar: ${user.avatar_url}
Criado em: ${user.joined_at}
Site: ${user.website ? user.website : '-'}
        `.trim()

        await conn.sendMessage( m.chat, { image: { url: user.avatar_url }, caption }, { quoted: m } )
    } catch (err) {
        m.reply('Erro:' + err.message)
    }
}

handler.help = ['twitterstalk']
handler.tags = ['stalk']
handler.command = /^(twitterstalk|xstalk)$/i

handler.register = true
handler.limit = true

export default handler
