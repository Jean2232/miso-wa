import { promises as fsPromises } from 'fs';
import { generateSlotSpinMp4 } from '../lib/roulette.js';

const symbols = {
    '🍒': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2919.png',
    '🍋': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2911.png',
    '🍉': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2909.png',
    '⭐': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3227.png',
    '💎': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3387.png',
};

/**
 * Retorna uma chave de símbolo aleatória.
 * @returns {string} Emoji.
 */
function getRandomSymbolKey() {
    const keys = Object.keys(symbols);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Gera o resultado da roleta, com 50% de chance de ser 3 iguais.
 * @returns {string[]} Array com os 3 resultados.
 */
function generateResult() {
    const isLucky = Math.random() < 0.5; // 50% de chance de ser 3 iguais

    if (isLucky) {
        const symbol = getRandomSymbolKey();
        return [symbol, symbol, symbol];
    } else {
        let result = [];
        while (result.length < 3) {
            const symbol = getRandomSymbolKey();
            // Permitir repetições, mas evitar 3 iguais se não for "lucky"
            if (result.length === 2 && result[0] === result[1] && result[1] === symbol) {
                continue;
            }
            result.push(symbol);
        }
        return result;
    }
}

let handler = async (m, { conn }) => {
    try {
        const finalResult = generateResult();

        await m.reply('🎰 Girando a roleta... aguarde!');

        const videoPath = await generateSlotSpinMp4(finalResult);

        await conn.sendMessage(m.chat, {
            video: { url: videoPath },
            gifPlayback: true
        }, { quoted: m });

        await fsPromises.unlink(videoPath);

        const isWin = finalResult.every(symbol => symbol === finalResult[0]);

        setTimeout(() => {
            conn.sendMessage(m.chat, {
                text: isWin ? '🎉 Parabéns, você GANHOU!' : '💔 Que pena, você PERDEU. Tente novamente!',
            }, { quoted: m });
        }, 6000); // 6 segundos

    } catch (error) {
        console.error('Erro na roleta:', error);
        m.reply('❌ Ocorreu um erro ao gerar sua roleta. Tente novamente mais tarde.');
    }
};

handler.help = ['roleta'];
handler.tags = ['fun'];
handler.command = /^roleta$/i;

export default handler;
