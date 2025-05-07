import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Insira um nome de usuário válido!'
    let username = text.trim()

    m.reply('Aguarde...')

    try {
        const { data } = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/youtube?username=${username}`)
        let channel = data.channelMetadata
        let videos = data.videoDataList || []

        let caption = `
Usuário: ${channel.username}
Canal: ${channel.channelUrl}
ID Externo: ${channel.externalId}
Inscritos: ${channel.subscriberCount ?? 'N/A'}
Vídeos: ${channel.videoCount ?? 'N/A'}
Descrição: ${channel.description}
Conteúdo Familiar: ${channel.isFamilySafe ? 'Sim' : 'Não'}
        `.trim()

        if (videos.length > 0) {
            caption += '\n\nÚltimos Vídeos:'
            videos.slice(0, 2).forEach((video, index) => {
                caption += `\n\nVídeo ${index + 1}:\nTítulo: ${video.title}\nDuração: ${video.duration}\nLink: https://www.youtube.com${video.navigationUrl}`
            })
        }

        await conn.sendMessage( m.chat, { image: { url: channel.avatarUrl }, caption }, { quoted: m } )
    } catch (err) {
        m.reply('Erro: ' + err.message)
    }
}

handler.help = ['ytstalk']
handler.tags = ['stalk']
handler.command = /^(ytstalk|youtubestalk)$/i

handler.register = true
handler.limit = true

export default handler
