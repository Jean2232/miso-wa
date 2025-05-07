import axios from 'axios'

async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        return Buffer.from(response.data, 'binary')
    } catch (error) {
        console.error('Erro ao buscar imagem:', error)
        return null
    }
}

var handler = async(m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, insira o nome de usuário.', m)

  await conn.reply(m.chat, 'Pesquisando...', m)

  try {
    let request = await githubstalk(text)
    let {
      username,
      following,
      followers,
      type,
      bio,
      company,
      blog,
      location,
      email,
      public_repo,
      public_gists,
      profile_pic,
      created_at,
      updated_at,
      html_url,
      name
    } = request;

    let thumb = await getBuffer(profile_pic);
    if (!thumb) {
      return conn.reply(m.chat, 'Erro ao obter imagem de perfil.', m)
    }

    let resultado = `*── 「 GITHUB STALK 」 ──*

➸ *Usuário*: ${username} (${name})
➸ *Link*: ${html_url}
➸ *Link dos Gists:* https://gist.github.com/${username}/
➸ *Bio*: _${bio}_
➸ *Empresa*: ${company}
➸ *Email:* ${email}
➸ *Blog:* ${blog}
➸ *Repositórios Públicos:* ${public_repo}
➸ *Gists Públicos:* ${public_gists}
➸ *Seguidores:* ${followers}
➸ *Seguindo:* ${following}
➸ *Localização:* ${location}
➸ *Tipo:* ${type}
➸ *Criado em:* ${created_at}
➸ *Última atualização:* ${updated_at}
`

    conn.sendFile(m.chat, thumb, 'githubstalk.jpg', resultado, m)
  } catch (error) {
    console.error('Erro:', error)
    conn.reply(m.chat, 'Ocorreu um erro ao processar sua solicitação.', m)
  }
}

handler.help = ['githubstalk <usuário>']
handler.tags = ['stalk']
handler.command = /^(githubstalk)$/i

export default handler;

async function githubstalk(user) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.github.com/users/' + user)
      .then(({ data }) => {
        let resultado = {
          username: data.login,
          name: data.name,
          bio: data.bio,
          id: data.id,
          nodeId: data.node_id,
          profile_pic: data.avatar_url,
          html_url: data.html_url,
          type: data.type,
          admin: data.site_admin,
          company: data.company,
          blog: data.blog,
          location: data.location,
          email: data.email,
          public_repo: data.public_repos,
          public_gists: data.public_gists,
          followers: data.followers,
          following: data.following,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        resolve(resultado);
      })
      .catch(error => {
        console.error('Erro da API:', error)
        reject(error)
      })
  })
}
