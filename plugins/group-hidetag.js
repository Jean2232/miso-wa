let handler = async (m, { conn, text, participants }) => {
    if (!text) throw '❌ Digite a mensagem que deseja enviar com *hidetag*.'

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Celular\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

    conn.sendMessage(m.chat, {
        text: text,
        mentions: participants.map(p => p.id)
    }, { quoted: fkontak })
}

handler.help = ['hidetag <mensagem>']
handler.tags = ['group']
handler.command = /^(hidetag)$/i

handler.group = true
handler.admin = true

export default handler
