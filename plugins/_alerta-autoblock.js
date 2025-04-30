let handler = m => m;

handler.before = async function (m) {
    // Verifica se a mensagem foi enviada em um grupo
    if (m.isGroup) {
        // Ignora mensagens em grupos
        return;
    }

    // Verifica se o usuário está banido
    let user = global.db.data.users[m.sender];
    if (user.banned === true) {
        // Obtém o timestamp atual
        let now = Date.now();
        // Verifica se o usuário foi notificado nas últimas 24 horas (86400000 milissegundos)
        if (!user.lastNotified || now - user.lastNotified > 86400000) {
            // Atualiza o timestamp da última notificação
            user.lastNotified = now;
            let banReason = user.banReason || 'Nenhum motivo informado.';
            m.reply(`Desculpe, seu número foi bloqueado de usar este bot.\n\nMotivo: ${banReason}`);
        }
        return;
    }
}

export default handler;
