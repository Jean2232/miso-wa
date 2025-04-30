import fs from 'fs'
import moment from 'moment-timezone'

let handler = m => m
handler.all = async function (m) {
    let name = await conn.getName(m.sender)
    let pp = global.logo
    try { pp = await this.profilePictureUrl(m.sender, 'image') } catch (e) { } 
    finally {
        // Modulos
        global.fetch = (await import('node-fetch')).default
        global.bochil = await import('@bochilteam/scraper')
        global.fs = fs

        const _uptime = process.uptime() * 1000

        // Função de boas vindas por Horário
        global.ucapan = horario()

        // Ordem temporária
        global.ephemeral = '86400'

        // externalAdReply | texto com miniatura.
        global.adReply = { contextInfo: { mentionedJid: [m.sender], forwardingScore: 9999, externalAdReply: { showAdAttribution: true, title: global.ucapan, body: wm, mediaUrl: sgw, description: namebot, previewType: "PHOTO", thumbnail: fs.readFileSync('./src/thumbnail.jpg'), sourceUrl: sgw } } };
        
        // Link do Instagram (usado para redirecionar menus)
        global.sig = { contextInfo: { externalAdReply: { showAdAttribution: true, title: global.ucapan, body: wm, thumbnailUrl: pp, sourceUrl: sig } } };

        // Link do Facebook (idem)
        global.sfb = { contextInfo: { externalAdReply: { showAdAttribution: true, title: global.ucapan, body: wm, thumbnailUrl: pp, sourceUrl: sfb } } };

        // Atualização de Status Falsa
        global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: wm, orderTitle: wm, sellerJid: '0@s.whatsapp.net' } } };

        // Contato Falso
        global.fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { contactMessage: { displayName: wm, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, jpegThumbnail: fs.readFileSync('src/'), thumbnail: fs.readFileSync('src/'), sendEphemeral: true } } };

        // Áudio Falso
        global.fvn = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6282127487538-1625305606@g.us" } : {}) }, message: { audioMessage: { mimetype: "audio/ogg; codecs=opus", seconds: "999999999999", ptt: "true" } } };

        // Texto Falso
        global.ftextt = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6282127487538-1625305606@g.us" } : {}) }, message: { extendedTextMessage: { text: wm, title: wm, jpegThumbnail: fs.readFileSync('src/') } } };

        // Localização em Tempo Real Falso
        global.fliveLoc = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { liveLocationMessage: { caption: "by : WH MODS DEV", h: `${wm}`, jpegThumbnail: fs.readFileSync('src/') } } };

        // Localização em Tempo Real Falso 2
        global.fliveLoc2 = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { liveLocationMessage: { title: "WH MODS DEV", h: wm, jpegThumbnail: fs.readFileSync('src/') } } };

        // Produto falso (usado em menus interativos)
        global.ftoko = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6282127487538@s.whatsapp.net" } : {}) }, message: { productMessage: { product: { productImage: { mimetype: "image/jpeg", jpegThumbnail: fs.readFileSync('src/') }, title: wm, description: "Simple Bot Esm", currencyCode: "USD", priceAmount1000: "20000000", retailerId: "Ghost", productImageCount: 1 }, businessOwnerJid: `0@s.whatsapp.net` } } };

        // Documento Falso
        global.fdocs = { key: { participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: wm, jpegThumbnail: fs.readFileSync('src/') } } }

        // Link de Convite Falso
        global.fgclink = { key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" }, message: { groupInviteMessage: { groupJid: "6282127487538-1625305606@g.us", inviteCode: "null", groupName: "Kawan WH MODS DEV", caption: wm, jpegThumbnail: fs.readFileSync('src/') } } };

        // Docx, Xsl, PDF
        global.doc = pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"])

        // Vídeo enviado como se fosse um GIF
        global.fgif = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6282127487538-1625305606@g.us" } : {}) }, message: { videoMessage: { title: wm, h: `Hmm`, seconds: '999999999', gifPlayback: 'true', caption: wm, jpegThumbnail: fs.readFileSync('src/') } } };
    }
}

export default handler

    function horario() {
        const time = moment.tz('America/Sao_Paulo').format('HH')
        let res = "🥱"
        if (time >= 6) { res = "Bom dia 🌄" }
        if (time >= 12) { res = "Boa tarde ☀️" }
        if (time >= 18) { res = "Boa Noite 🌇" }
        return res
    }
function pickRandom(list) { return list[Math.floor(list.length * Math.random())] }
