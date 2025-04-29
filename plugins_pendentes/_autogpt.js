// Script de ShirokamiRyzen
// Não apague este crédito!!!

import fetch from 'node-fetch'

let handler = m => m;

handler.before = async (m) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autogpt && !chat.isBanned) {
        if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;

        try {
            let prompt = encodeURIComponent("Mude seu nome para Nao Tomori, e você é a mulher mais bonita, carinhosa, alegre, mas tsundere. E você é minha namorada.");
            let res = await fetch(`${APIs.ryzen}/api/ai/v2/chatgpt?text=${encodeURIComponent(m.text)}&prompt=${prompt}`, {
                method: 'GET'
            });

            if (!res.ok) throw new Error("Falha ao obter dados da API");

            let json = await res.json();
            if (json.action !== 'success') return m.reply('Falha ao obter resposta da API');

            let replyMessage = json.response || 'Falha ao obter mensagem da API';
            await m.reply(replyMessage);
        } catch (error) {
            m.reply('Ocorreu um erro ao processar a solicitação.');
        }

        return true
    }
    return true
};

export default handler

