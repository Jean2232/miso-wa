import moment from 'moment-timezone'
let handler = async (m, { conn, text, participants }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    let bcbg = 'https://telegra.ph/file/da19d1c4c1e23b8b9c72e.jpg'
    conn.send3ButtonLoc(m.chat, bcbg, wm, `${text ? `${text}\n` : ''}┌─「 Marcar Todos 」\n` + users.map(v => '│◦❒ @' + v.replace(/@.+/, '')).join`\n` + '\n└────','Menu', '.menu', 'Dono', '.owner', `\nKakek Gw Sugiono`, '.huuu', null, {
        mentions: users
    })
}
handler.help = ['o-tagall']
handler.tags = ['owner']
handler.command = ['o-tagall']
handler.owner = true
handler.group = true
handler.register = true
export default handler