import axios from 'axios'

let handler = async (m, { conn, args }) => {
    const userId = args[0]

    if (!userId) throw 'Insira o ID do usuário!'

    let { key } = await conn.sendMessage(m.chat, {
        text: "Verificando dados da conta...",
    })

    try {
        let res = await axios.get(`https://apidl.asepharyana.cloud/api/stalk/freefire?userId=${userId}`)
        let result = res.data

        if (!result.name) throw 'A API não retornou dados válidos.'

        let equippedItemsText = ''
        if (result.equippedItems && Array.isArray(result.equippedItems)) {
            equippedItemsText = result.equippedItems
                .map((item, index) => `${index + 1}. ${item.name}`)
                .join('\n')
        }

        let ini_text = `
*INFORMAÇÕES PRINCIPAIS*
> Nome: ${result.name}
> Bio: ${result.bio}
> Curtidas: ${result.like}
> Nível: ${result.level}
> Exp: ${result.exp}
> Região: ${result.region}
> Pontuação de Honra: ${result.honorScore}
> Ranque BR: ${result.brRank} (${result.brRankPoint})
> Pontuação CS: ${result.csRankPoint}
> Conta criada em: ${result.accountCreated}
> Último login: ${result.lastLogin}
> Modo Preferido: ${result.preferMode}
> Idioma: ${result.language}
> Nível Booyah Pass: ${result.booyahPassLevel}

*INFORMAÇÕES DO PET*
> Nome: ${result.petInformation.name}
> Nível: ${result.petInformation.level}
> Exp: ${result.petInformation.exp}
> Estrela marcada: ${result.petInformation.starMarked}
> Selecionado: ${result.petInformation.selected}

*ITENS EQUIPADOS*
${equippedItemsText}
        `

        await conn.sendMessage(m.chat, {
            text: ini_text,
            edit: key
        })
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `Erro na API: ${e}`,
            edit: key
        })
    }
}

handler.help = ['ffstalk']
handler.tags = ['stalk']
handler.command = /^(stalkff|ffstalk)$/i

handler.register = true
handler.limit = true

export default handler
