import { createCanvas, loadImage } from 'canvas';
import { createWriteStream, promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg'; // Certifique-se de ter 'fluent-ffmpeg' instalado (npm install fluent-ffmpeg)
import { rimraf } from 'rimraf'; // Para limpar diretórios temporários (npm install rimraf)
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos (npm install uuid)

// Obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎨 Definir imagens dos símbolos
const symbols = {
    '🍒': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2919.png',
    '🍋': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2911.png',
    '🍉': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-2909.png',
    '⭐': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3227.png',
    '💎': 'https://www.imagenspng.com.br/wp-content/uploads/2022/11/emoji-png-3387.png',
};

const backgroundUrl = 'https://i.ibb.co/SDhSHLzk/casasdeaposta.jpg';

const size = 300;
const delay = 50; // Atraso entre os quadros em milissegundos
const fps = 1000 / delay; // Calcular FPS a partir do delay
const slotCount = 3;
const spinFrames = [50, 63, 72];
const symbolSize = 80;
const transitionFrames = 30;
const initialScrollSpeed = 25;

/**
 * Função de easing (desaceleração) para um movimento suave.
 * Usa uma função cúbica de ease-out para desacelerar o movimento.
 * @param {number} t - Progresso normalizado (entre 0 e 1).
 * @returns {number} O valor de easing.
 */
function easeOutCubic(t) {
    return --t * t * t + 1;
}

/**
 * Retorna um símbolo aleatório da lista de símbolos disponíveis.
 * @returns {string} Uma chave de símbolo aleatória (ex: '🍒').
 */
function getRandomSymbol() {
    const keys = Object.keys(symbols);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * 📥 Carrega as imagens dos símbolos e o background.
 * @returns {Promise<Object>} Um objeto contendo as imagens carregadas.
 */
async function loadSymbolImages() {
    const images = {};
    for (const [key, url] of Object.entries(symbols)) {
        try {
            images[key] = await loadImage(url);
        } catch (error) {
            console.error(`Erro ao carregar imagem para o símbolo ${key} de ${url}:`, error);
            // Fallback para um placeholder ou tratamento de erro
            images[key] = await loadImage(`https://placehold.co/${symbolSize}x${symbolSize}/FF0000/FFFFFF?text=ERR`);
        }
    }
    try {
        images.background = await loadImage(backgroundUrl);
    } catch (error) {
        console.error(`Erro ao carregar imagem de fundo de ${backgroundUrl}:`, error);
        // Fallback para um fundo sólido
        const tempCanvas = createCanvas(size, size);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = '#444';
        tempCtx.fillRect(0, 0, size, size);
        images.background = tempCanvas; // Usar o canvas como imagem de fundo
    }
    return images;
}

/**
 * 🔀 Pré-gerar sequências de símbolos para cada slot.
 * @param {string[]} finalResult - O array de símbolos para o resultado final.
 * @returns {Array<Array<string>>} As sequências de símbolos para cada rolo.
 */
function generateSymbolSequences(finalResult) {
    const sequences = [];

    for (let i = 0; i < slotCount; i++) {
        const framesBeforeStop = spinFrames[i];
        // Calcula quantos símbolos são necessários para preencher a rolagem antes da parada
        // Adiciona alguns símbolos extras para garantir que haja o suficiente para a transição
        const symbolsInScroll = Math.ceil((framesBeforeStop * initialScrollSpeed) / symbolSize) + transitionFrames + 5;

        const slotSequence = [];
        for (let j = 0; j < symbolsInScroll; j++) {
            slotSequence.push(getRandomSymbol());
        }

        // Garante que o resultado final seja o último símbolo na sequência
        slotSequence.push(finalResult[i]);
        sequences.push(slotSequence);
    }
    return sequences;
}

/**
 * 🖼️ Cria um buffer de fundo com a imagem de background.
 * @param {Object} images - Objeto contendo as imagens carregadas.
 * @returns {Canvas} O canvas de fundo pré-renderizado.
 */
function createBackgroundBuffer(images) {
    const bgCanvas = createCanvas(size, size);
    const bgCtx = bgCanvas.getContext('2d');
    bgCtx.drawImage(images.background, 0, 0, size, size);
    return bgCanvas;
}

/**
 * 🎨 Desenha um frame no contexto do canvas.
 * @param {CanvasRenderingContext2D} ctx - O contexto de renderização 2D do canvas.
 * @param {Canvas} bgBuffer - O canvas de fundo pré-renderizado.
 * @param {Object} images - Objeto contendo as imagens dos símbolos.
 * @param {number} currentFrame - O número do quadro atual.
 * @param {Array<Array<string>>} sequences - As sequências de símbolos para cada rolo.
 */
function drawFrame(ctx, bgBuffer, images, currentFrame, sequences) {
    // Limpa o canvas para cada novo frame
    ctx.clearRect(0, 0, size, size);

    // Desenha o fundo estático do bgBuffer no canvas atual
    ctx.drawImage(bgBuffer, 0, 0);

    const slotWidth = size / slotCount;

    for (let i = 0; i < slotCount; i++) {
        const centerX = (i + 0.5) * slotWidth;
        const spinDuration = spinFrames[i];
        const sequence = sequences[i];

        if (currentFrame < spinDuration) {
            // Fase de giro ou transição para parar
            const transitionStart = spinDuration - transitionFrames;
            let offsetY; // Deslocamento vertical para a rolagem

            if (currentFrame >= transitionStart) {
                // Fase de desaceleração/aterrissagem do símbolo
                const progress = (currentFrame - transitionStart) / transitionFrames;
                // Calcula o deslocamento final para o símbolo aterrissar no centro
                offsetY = easeOutCubic(progress) * symbolSize; // Deslocamento para cima
            } else {
                // Fase de giro rápido
                offsetY = (currentFrame * initialScrollSpeed) % symbolSize;
            }

            // Calcula o deslocamento total para determinar qual parte da sequência exibir
            const totalShift = Math.floor((currentFrame * initialScrollSpeed) / symbolSize);

            // Desenha vários símbolos para criar a ilusão de rolagem
            // J vai de -2 a 3 para cobrir a área visível do slot
            for (let j = -2; j <= 3; j++) {
                // Calcula o índice do símbolo na sequência, garantindo que ele se repita
                const symbolIndex = (totalShift + j + sequence.length) % sequence.length;
                const symbolKey = sequence[symbolIndex]; // Chave do símbolo (ex: '🍒')
                const symbolImage = images[symbolKey];

                // Posição Y do centro do símbolo
                const yPos = (size / 2) + (j * symbolSize) - offsetY;

                // Desenha a imagem do símbolo
                if (symbolImage) {
                    ctx.drawImage(symbolImage, centerX - symbolSize / 2, yPos - symbolSize / 2, symbolSize, symbolSize);
                }
            }
        } else {
            // O rolo parou: exibe o símbolo final centralizado
            const symbolKey = sequence[sequence.length - 1]; // O último símbolo é o resultado final
            const symbolImage = images[symbolKey];
            if (symbolImage) {
                ctx.drawImage(symbolImage, centerX - symbolSize / 2, size / 2 - symbolSize / 2, symbolSize, symbolSize);
            }
        }
    }
}

/**
 * Gera um vídeo MP4 animado de slot machine.
 * @param {string[]} finalResult - Array de 3 emojis que serão os símbolos finais.
 * @returns {Promise<string>} O caminho para o arquivo MP4 gerado.
 */
export async function generateSlotSpinMp4(finalResult = ['💎', '💎', '💎']) {
    if (!Array.isArray(finalResult) || finalResult.length !== slotCount) {
        throw new Error(`finalResult precisa ser um array de ${slotCount} emojis.`);
    }

    const images = await loadSymbolImages();
    const sequences = generateSymbolSequences(finalResult);
    const bgBuffer = createBackgroundBuffer(images); // O buffer de fundo é criado uma vez

    // Configurações para o FFmpeg
    const outputFileName = 'slot_spin.mp4';
    // --- NOVIDADE: Diretório temporário único para cada requisição ---
    const uniqueId = uuidv4(); // Gera um ID único
    const tempDir = path.join(__dirname, `temp_frames_${uniqueId}`); // Diretório temporário único
    // --- FIM DA NOVIDADE ---
    const framePattern = 'frame_%04d.png'; // Padrão de nome dos arquivos de frame

    // Garante que o diretório temporário exista e esteja limpo
    await rimraf(tempDir); // Limpa se já existir
    await fsPromises.mkdir(tempDir, { recursive: true });

    const maxFrames = Math.max(...spinFrames);
    const holdFrames = Math.ceil(3000 / delay); // Segura o resultado final por 3 segundos

    console.log(`Gerando ${maxFrames + holdFrames + 1} frames PNG em ${tempDir}...`);

    for (let frame = 0; frame <= maxFrames + holdFrames; frame++) {
        // Cria um novo canvas e contexto para cada frame
        const frameCanvas = createCanvas(size, size);
        const frameCtx = frameCanvas.getContext('2d');

        // Passa o novo contexto para drawFrame
        drawFrame(frameCtx, bgBuffer, images, frame, sequences);

        const framePath = path.join(tempDir, framePattern.replace('%04d', String(frame).padStart(4, '0')));
        const out = createWriteStream(framePath);
        // Usa o novo frameCanvas para criar o stream PNG
        const stream = frameCanvas.createPNGStream();
        stream.pipe(out);
        await new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
        });
    }

    console.log('Frames PNG gerados. Iniciando codificação MP4 com FFmpeg...');

    // Define o caminho de saída do vídeo dentro do diretório temporário para evitar conflitos de nome
    const finalOutputPath = path.join(tempDir, outputFileName);

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.join(tempDir, framePattern)) // Entrada: sequência de imagens
            .inputOptions([
                `-framerate ${fps}` // Define o framerate de entrada
            ])
            .outputOptions([
                '-c:v libx264',      // Codec de vídeo H.264
                '-pix_fmt yuv420p',  // Formato de pixel para ampla compatibilidade
                '-preset medium',    // Velocidade de codificação (pode ser 'fast', 'slow', etc.)
                '-crf 23',           // Qualidade (0-51, 0 é lossless, 23 é padrão)
                '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2' // Garante dimensões divisíveis por 2 para compatibilidade
            ])
            .output(finalOutputPath) // Saída para o diretório temporário
            .on('end', async () => {
                console.log(`Vídeo MP4 gerado: ${finalOutputPath}`);
                // Retorna o caminho completo do arquivo para que o chamador possa movê-lo/enviá-lo
                resolve(finalOutputPath);
            })
            .on('error', async (err) => {
                console.error('Erro ao gerar vídeo MP4 com FFmpeg:', err.message);
                reject(err);
            })
            .run();
    }).finally(async () => {
        // --- NOVIDADE: Limpa o diretório temporário no final, independentemente do sucesso ou falha ---
        await rimraf(tempDir);
        console.log(`Arquivos temporários em ${tempDir} limpos.`);
        // --- FIM DA NOVIDADE ---
    });
}

// O bloco de execução direta foi removido para que este arquivo possa ser importado como uma biblioteca.
// Exemplo de como usar (em outro arquivo, por exemplo, 'app.js' ou 'main.js'):
// import { generateSlotSpinMp4 } from './slotMachineGenerator.js'; // Ajuste o caminho conforme necessário
//
// const resultadoFinal = ["⭐", "💎", "🍒"];
// generateSlotSpinMp4(resultadoFinal)
//     .then(filePath => console.log(`Vídeo salvo em: ${filePath}`))
//     .catch(error => console.error('Falha ao gerar vídeo:', error));
