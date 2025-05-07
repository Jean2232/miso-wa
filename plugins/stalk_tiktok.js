import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Insira um nome de usuário válido!'
    let username = text.trim()

    m.reply('Aguarde...')

    try {
        const { data } = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/tiktok?username=${username}`)
        const user = data.userInfo

        let caption = `
ID: ${user.id}
Usuário: ${user.username}
Nome: ${user.name}
Bio: ${user.bio}
Verificado: ${user.verified ? 'Sim' : 'Não'}
Seguidores: ${user.totalFollowers}
Seguindo: ${user.totalFollowing}
Curtidas: ${user.totalLikes}
Vídeos: ${user.totalVideos}
Amigos: ${user.totalFriends}
Avatar: ${user.avatar}
        `.trim()

        await conn.sendMessage( m.chat, { image: { url: user.avatar }, caption }, { quoted: m } )
    } catch (err) {
        m.reply('Erro: ' + err.message)
    }
}

handler.help = ['ttstalk']
handler.tags = ['stalk']
handler.command = /^(ttstalk|tiktokstalk)$/i

handler.register = true
handler.limit = true

export default handler
