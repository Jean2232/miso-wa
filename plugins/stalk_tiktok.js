import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Insira o nome de usuário do TikTok.'

    m.reply('🔍 Buscando perfil no TikTok...')

    try {
        const { data } = await axios.get(`https://api.vreden.my.id/api/tiktokStalk?query=${encodeURIComponent(text.trim())}`)

        if (!data.status || !data.result || !data.result.user) {
            throw 'Perfil não encontrado ou resposta inválida.'
        }

        const user = data.result.user
        const stats = data.result.stats

        const caption = `
🎵 *Perfil do TikTok*
• 🆔 ID: ${user.id}
• 👤 Usuário: @${user.uniqueId}
• 📛 Nome: ${user.nickname}
• 🧾 Bio: ${user.signature || 'Nenhuma'}
• 🌍 Região: ${user.region || 'Desconhecida'}
• ✅ Verificado: ${user.verified ? 'Sim' : 'Não'}
• 👥 Seguidores: ${stats.followerCount}
• 👣 Seguindo: ${stats.followingCount}
• ❤️ Curtidas: ${stats.heart}
• 🎬 Vídeos: ${stats.videoCount}
• 👯 Amigos: ${stats.friendCount}
• 🔗 Link: https://www.tiktok.com/@${user.uniqueId}
        `.trim()

        await conn.sendMessage(m.chat, {
            image: { url: user.avatarLarger },
            caption
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        m.reply('❌ Erro ao buscar perfil. Verifique o nome de usuário ou tente novamente mais tarde.')
    }
}

handler.help = ['ttstalk <usuário>']
handler.tags = ['stalk']
handler.command = /^(ttstalk|tiktokstalk)$/i
handler.register = true
handler.limit = true

export default handler
