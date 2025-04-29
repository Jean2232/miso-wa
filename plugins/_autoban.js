let handler = m => m

handler.before = async function (m) {
    let regionData = {
        '212': 'Marrocos (+212)',
        '265': 'Malawi (+265)',
        '91': 'Índia (+91)',
        '90': 'Turquia (+90)',
        '62': 'Turquia (+62)',
        '63': 'Turquia (+63)',
        '90': 'Turquia (+90)',
        '91': 'Turquia (+91)',
        '92': 'Turquia (+92)',
    };

    let senderNumber = m.sender

    for (let countryCode in regionData) {
        if (senderNumber.startsWith(countryCode)) {
            global.db.data.users[m.sender].banned = true
            let bannedCountries = Object.values(regionData).join('\n');
            m.reply(`Desculpe, você não pode usar este bot neste momento porque o código do seu país foi banido devido a solicitações de spam.\n\nLista de Países Bloqueados:\n${bannedCountries}`);
            return
        }
    }
}

export default handler
