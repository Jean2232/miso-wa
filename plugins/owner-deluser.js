let handler = async (m, { conn, text }) => {
    function no(number) {
        return number.replace(/\s/g, '').replace(/([@+-])/g, '');
    }

    let numbers = text.split(/\s+/).map(no);

    if (!numbers.length && !m.quoted) {
        return conn.reply(m.chat, `*❏ DELETAR USUÁRIO*

Marque o usuário, digite o número ou responda a uma mensagem de quem deseja remover`, m);
    }

    let deletedUsers = [];

    for (let i = 0; i < numbers.length; i++) {
        let number = numbers[i];

        if (isNaN(number) || number.length > 15) {
            conn.reply(m.chat, `*❏ DELETAR USUÁRIO*

Número '${number}' inválido!`, m);
            continue;
        }

        let user = number + '@s.whatsapp.net';
        let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
        let participants = m.isGroup ? groupMetadata.participants : [];
        let users = m.isGroup ? participants.find(u => u.jid == user) : {};

        if (users) {
            delete global.db.data.users[user];
            deletedUsers.push(`@${number}`);
        } else {
            conn.reply(m.chat, `*❏ DELETAR USUÁRIO*

Usuário com número @${number} não encontrado no grupo!`, m);
        }
    }

    if (deletedUsers.length > 0) {
        conn.reply(m.chat, `*❏ DELETAR USUÁRIO*

Removido com sucesso ${deletedUsers.join(', ')} do *BANCO DE DADOS*`, null, {
            contextInfo: {
                mentionedJid: deletedUsers.map(u => u + '@s.whatsapp.net')
            }
        });
    }
}
handler.help = ['deleteuser']
handler.tags = ['owner']
handler.command = /^(d(el)?(ete)?u(ser)?|ha?pu?su(ser)?)$/i
handler.owner = true
export default handler
