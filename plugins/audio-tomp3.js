import { toMP3 } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''

    if (!/video|audio/.test(mime)) throw `Responda a um vídeo ou áudio que deseja converter para *mp3* com a legenda *${usedPrefix + command}*`

    let media = await q.download?.()
    if (!media) throw 'Não foi possível baixar a mídia.'

    let audio = await toMP3(media, 'mp4')
    if (!audio.data) throw 'Não foi possível converter a mídia para MP3.'

    conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, {
        mimetype: 'audio/mpeg',
        asDocument: chat.useDocument
    })
}

handler.help = ['tomp3 (video)']
handler.tags = ['audio']
handler.command = /^to(mp3|a(udio)?)$/i
handler.register = true

export default handler
