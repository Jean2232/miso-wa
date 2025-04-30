let { downloadContentFromMessage } = (await import('@adiwajshing/baileys'));
import { format } from 'util';

let handler = m => m;

// Regex para detectar links indesejados (grupos, conteúdo adulto etc.)
let linkRegex = /(chat.whatsapp.com|whatsapp.com|wa.me|xnxx.com|xvideos.com|pornhub.com)\/([0-9A-Za-z]{1,99999})/i

handler.before = async function (m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true

    let chat = global.db.data.chats[m.chat]
    let isGroupLink = linkRegex.exec(m.text)

    if (chat.antiLink && isGroupLink && !isAdmin && !m.isBaileys && m.isGroup) {
        let thisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
        
        // Ignora se o link for do próprio grupo
        if (m.text.includes(thisGroup)) throw false

        if (!isBotAdmin) {
            m.reply(`*「 ANTILINK 」* ${
                isAdmin ? "Você é admin, então está liberado 😎" :
                `\n\nLink de grupo detectado, mas o bot não é admin para remover o usuário!`
            }`)
        }

        if (isBotAdmin) {
            m.reply(`*「 ANTILINK 」*\n\nLink de grupo detectado! Você será removido.`.trim())
            await this.delay(500)
            await this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
            await this.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: m.id }}) // Remove a mensagem com o link
        }
    }
    return true
}

// Módulo para desativar "visualização única"
export async function before(m, { isAdmin, isBotAdmin }) {
    let chat = db.data.chats[m.chat]

    // Ignora se for comandos específicos
    if (/^[.~#/\$,](read)?viewonce/.test(m.text)) return

    if (!chat.viewonce || chat.isBanned) return

    // Se for uma mensagem de visualização única
    if (m.mtype == 'viewOnceMessageV2') {
        let msg = m.message.viewOnceMessageV2.message
        let type = Object.keys(msg)[0]

        let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
        let buffer = Buffer.from([])

        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (/video/.test(type)) {
            return this.sendFile(m.chat, buffer, 'video.mp4', msg[type].caption || '', m)
        } else if (/image/.test(type)) {
            return this.sendFile(m.chat, buffer, 'imagem.jpg', msg[type].caption || '', m)
        }
    }
}
