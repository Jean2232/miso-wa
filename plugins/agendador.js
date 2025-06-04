let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {};
    }
    if (!global.db.data.chats[m.chat].schedules) {
        global.db.data.chats[m.chat].schedules = {};
    }

    const chatSchedules = global.db.data.chats[m.chat].schedules;

    if (args.length === 0) {
        let scheduleMsg = `*Agendamento do Grupo:*\n`;
        if (chatSchedules.open) {
            scheduleMsg += `  • Abrir: ${chatSchedules.open}\n`;
        }
        if (chatSchedules.close) {
            scheduleMsg += `  • Fechar: ${chatSchedules.close}\n`;
        }
        if (!chatSchedules.open && !chatSchedules.close) {
            scheduleMsg += `  Nenhum agendamento definido para este grupo.\n`;
        }
        scheduleMsg += `\n*Como usar:*\n`;
        scheduleMsg += `  • ${usedPrefix + command} abrir HH:MM\n`;
        scheduleMsg += `  • ${usedPrefix + command} fechar HH:MM\n`;
        scheduleMsg += `  • ${usedPrefix + command} limpar (para remover todos os agendamentos)\n`;
        return m.reply(scheduleMsg);
    }

    const action = args[0].toLowerCase();
    const time = args[1];

    if (action === 'limpar') {
        delete global.db.data.chats[m.chat].schedules; // Remove todos os agendamentos para este chat
        return m.reply('Todos os agendamentos para este grupo foram removidos.');
    }

    if (!['abrir', 'fechar'].includes(action)) {
        return m.reply(`Ação inválida. Use 'abrir', 'fechar' ou 'limpar'.\n${usedPrefix + command}`);
    }

    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
        return m.reply(`Formato de hora inválido. Use HH:MM (ex: 08:00).\n${usedPrefix + command}`);
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return m.reply(`Hora ou minuto inválido. Use HH:MM (ex: 08:00).\n${usedPrefix + command}`);
    }

    if (action === 'abrir') {
        chatSchedules.open = time;
        m.reply(`Agendamento para abrir o grupo definido para ${time}.`);
    } else if (action === 'fechar') {
        chatSchedules.close = time;
        m.reply(`Agendamento para fechar o grupo definido para ${time}.`);
    }

    await global.db.write();
};

handler.help = ['agendar [abrir/fechar] [HH:MM]', 'agendar limpar'];
handler.tags = ['group'];
handler.command = /^agendar$/i;

handler.group = true;
handler.admin = true;

export default handler;