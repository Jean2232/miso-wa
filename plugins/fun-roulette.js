import { promises as fsPromises } from 'fs'; // Para deletar o arquivo de vídeo após o envio
import { generateSlotSpinMp4 } from '../lib/roulette'; // Ajuste o caminho conforme onde você salvou o arquivo da biblioteca

// Define os símbolos que podem ser sorteados para a roleta.
// Estes devem corresponder aos símbolos definidos em 'slotMachineGenerator.js'
const symbols = {
    '🍒': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2919.png',
    '🍋': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2911.png',
    '🍉': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2909.png',
    '⭐': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3227.png',
    '💎': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3387.png',
};

/**
 * Retorna uma chave de símbolo aleatória da lista de símbolos disponíveis.
 * @returns {string} Uma chave de símbolo aleatória (ex: '🍒').
 */
function getRandomSymbolKey() {
    const keys = Object.keys(symbols);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Handler para o comando 'roleta'.
 * Gera um vídeo MP4 de uma roleta de caça-níquel com emojis sorteados e o envia ao usuário.
 * @param {object} m - O objeto da mensagem (do framework do bot).
 * @param {object} options - Opções adicionais, incluindo o objeto 'conn' para enviar arquivos.
 */
let handler = async (m, { conn }) => {
    try {
        // Gera 3 emojis aleatórios para o resultado final da roleta
        const finalResult = [
            getRandomSymbolKey(),
            getRandomSymbolKey(),
            getRandomSymbolKey()
        ];

        // Informa o usuário que o vídeo está sendo gerado (pode levar um tempo)
        m.reply('Gerando sua roleta... isso pode levar um momento!');

        // Gera o vídeo MP4 da roleta usando a função da biblioteca
        const videoPath = await generateSlotSpinMp4(finalResult);

        // Envia o vídeo gerado para o usuário
        // A legenda agora inclui os emojis sorteados
        await conn.sendFile(m.chat, videoPath, 'roleta_sorte.mp4', `🎰 Resultado da Roleta: ${finalResult.join(' ')}`, m);

        // Limpa o arquivo de vídeo gerado após o envio para economizar espaço em disco
        await fsPromises.unlink(videoPath);
        console.log(`Vídeo ${videoPath} excluído após o envio.`);

    } catch (error) {
        console.error('Erro ao gerar ou enviar a roleta:', error);
        // Informa o usuário sobre o erro
        m.reply('Desculpe, houve um erro ao gerar a roleta. Tente novamente mais tarde.');
    }
};

// Define as informações de ajuda, tags e o comando para o plugin
handler.help = ['roleta'];
handler.tags = ['fun'];
handler.command = /^roleta$/i; // O comando que ativará este handler (ex: digitando 'roleta')

export default handler;
