import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const userId = args[0]
    const zoneId = args[1]

    if (!userId) throw 'Insira o ID do usuário'
    if (!zoneId) throw 'Insira o ID do servidor'

    let { key } = await conn.sendMessage(m.chat, {
        text: "Verificando dados da conta...",
    });

    try {
        let res = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/mobile-legends?userId=${userId}&zoneId=${zoneId}`)
        let result = res.data

        if (!result.success) throw 'A API não retornou dados válidos'

        let ini_text = `
*RESULTADO*

> Usuário: ${result.username}
> Região: ${result.region}
        `

        await conn.sendMessage(m.chat, {
            text: ini_text,
            edit: key
        });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `Erro da API: ${e}`,
            edit: key
        });
    }
}

handler.help = ['mlstalk']
handler.tags = ['stalk']
handler.command = /^(stalkml|mlstalk)$/i

handler.register = true
handler.limit = true

export default handler
