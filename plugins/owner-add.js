import fetch from 'node-fetch'
const { getBinaryNodeChild, getBinaryNodeChildren } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, text, participants }) => {
    let _participants = participants.map(user => user.id)
    let users = (await Promise.all(
        text.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async v => [
                v,
                await conn.onWhatsApp(v + '@s.whatsapp.net')
            ])
    )).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us')

    const response = await conn.query({
        tag: 'iq',
        attrs: { type: 'set', xmlns: 'w:g2', to: m.chat },
        content: users.map(jid => ({
            tag: 'add',
            attrs: {},
            content: [{ tag: 'participant', attrs: { jid } }]
        }))
    })

    const pp = await conn.profilePictureUrl(m.chat).catch(_ => null)
    const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0)

    const add = getBinaryNodeChild(response, 'add')
    const participant = getBinaryNodeChildren(add, 'participant')

    for (const user of participant.filter(item => item.attrs.error == 403)) {
        const jid = user.attrs.jid
        const content = getBinaryNodeChild(user, 'add_request')
        const invite_code = content.attrs.code
        const invite_code_exp = content.attrs.expiration
        let msg = `Convidando @${jid.split('@')[0]} via link...`
        m.reply(msg, null, { mentions: conn.parseMention(msg) })
        await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, await conn.getName(m.chat), 'Convite para grupo', jpegThumbnail)
    }
}
handler.help = ['add', '+'].map(v => 'o' + v + ' @usuario')
handler.tags = ['owner']
handler.command = /^(oadd|o\+)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler
