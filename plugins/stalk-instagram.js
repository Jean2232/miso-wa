import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Insira o nome de usuário do Instagram.'

  m.reply('🔍 Buscando perfil...')

  try {
    const res = await axios.get(`https://api.vreden.my.id/api/igstalk?query=${encodeURIComponent(text.trim())}`)
    const user = res.data.result.user

    let caption = `
🔎 *Perfil do Instagram*
• 👤 Nome: ${user.full_name}
• 🆔 Usuário: @${user.username}
• 🏷️ Categoria: ${user.category || 'Não especificada'}
• 👥 Seguidores: ${user.follower_count}
• 👣 Seguindo: ${user.following_count}
• 🖼️ Publicações: ${user.media_count}
• 📖 Bio:
${user.biography || 'Nenhuma'}
${user.external_url ? `\n🔗 Website: ${user.external_url}` : ''}
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: user.hd_profile_pic_url_info?.url || user.profile_pic_url_hd },
      caption
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Erro ao buscar o perfil. Verifique o nome de usuário ou tente novamente mais tarde.')
  }
}

handler.help = ['igstalk <usuario>']
handler.tags = ['stalk']
handler.command = /^(igstalk|instagramstalk)$/i
handler.limit = true
handler.register = true

export default handler
