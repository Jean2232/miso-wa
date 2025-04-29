let handler = async (m) => {

  let totalreg = Object.keys(global.db.data.users).length
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
  let kon = `*Atualmente há ${totalreg} usuários no banco de dados*\n*Usuários registrados: ${rtotalreg}*\n\nPara remover usuários não registrados, digite *.delete-unreg*`
  m.reply(kon)
}

handler.help = ['user']
handler.tags = ['info']
handler.command = /^(user)$/i

handler.owner = true

export default handler
