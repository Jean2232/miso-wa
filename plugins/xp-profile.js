import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix }) => {
  let pp = './src/avatar_contact.png'
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

  try {
    pp = await conn.profilePictureUrl(who)
  } catch (e) {
    // Usa imagem padrão se não conseguir pegar a foto
  } finally {
    let { name, limit, exp, lastclaim, registered, regTime, age, level, role } = global.db.data.users[who]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let username = conn.getName(who)
    let faltam = max - xp
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Sim' : 'Não'}`

    let str = `
                *PERFIL*
   • *Nome:* ${username} ${registered ? '(' + name + ') ' : ''}(@${who.replace(/@.+/, '')})
   • *Número:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
   • *Link:* https://wa.me/${who.split`@`[0]}
   • *Idade:* ${registered ? age : 'Não informada'}
   • *XP:* ${exp} (${exp - min} / ${xp})
   • *Nível:* ${level}
   • *Função:* ${role}
   • *Limite:* ${limit}
   • *Registrado:* ${registered ? 'Sim (' + new Date(regTime).toLocaleDateString() + ')' : 'Não'}
   • *Premium:* ${prems}
`.trim()

    let mentionedJid = [who]
    conn.sendFile(m.chat, pp, 'pp.jpg', str, m, false, { contextInfo: { mentionedJid } })
  }
}

handler.help = ['xpprofile [@]', 'xpperfil [@]']
handler.tags = ['exp']
handler.command = /^xpprofile|xpperfil$/i

export default handler
