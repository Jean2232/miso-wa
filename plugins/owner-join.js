let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i;

let handler = async (m, { conn, text, isOwner }) => {
    let [_, code, expired] = text.match(linkRegex) || [];
    if (!code) throw 'Link inválido';
    let res;
    try {
        res = await conn.groupAcceptInvite(code);
    } catch (error) {
        if (error && error.message) {
            if (error.message.includes('not-authorized')) {
                return m.reply(`
Não foi possível entrar pois este número foi removido anteriormente.
Aguarde até 7 dias e não faça SPAM!

Nota: Relatos sobre isso não serão respondidos pelo proprietário do bot.
                `);
            } else if (error.message.includes('gone')) {
                return m.reply('Link inválido ou já foi redefinido pelo administrador');
            }
        }
        throw error;
    }

    let user = global.db.data.users[m.sender];
    let now = Date.now();
    let maxTime = Math.floor((user.premiumTime - now) / (1000 * 60 * 60 * 24)); // dias restantes de premium

    expired = Math.floor(Math.min(maxTime, Math.max(1, isOwner ? (isNumber(expired) ? parseInt(expired) : 0) : 3)));
    if (expired > maxTime) {
        return m.reply(`O tempo máximo de permanência no grupo segue seu tempo premium.\nVocê possui no máximo ${maxTime} dia(s).`);
    }

    m.reply(`Entrei no grupo com sucesso: ${res}${expired ? ` por ${expired} dia(s)

Se o grupo tiver aprovação de administrador, por favor aprove este número.` : ''}`);
    let chats = global.db.data.chats[res];
    if (!chats) chats = global.db.data.chats[res] = {};
    if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24;
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = /^join$/i;
handler.rowner = false;
handler.premium = true;

export default handler;

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x));
