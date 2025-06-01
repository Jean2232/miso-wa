import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';

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
const delay = 50;
const slotCount = 3;
const spinFrames = [50, 63, 72];
const symbolSize = 80;
const transitionFrames = 30;
const initialScrollSpeed = 25;

function easeOutCubic(t) {
  return --t * t * t + 1;
}

function getRandomSymbol() {
  const keys = Object.keys(symbols);
  return keys[Math.floor(Math.random() * keys.length)];
}

// 📥 Carrega os símbolos e o background
async function loadSymbolImages() {
  const images = {};
  for (const [key, url] of Object.entries(symbols)) {
    images[key] = await loadImage(url);
  }
  images.background = await loadImage(backgroundUrl);
  return images;
}

// 🔀 Pré-gerar sequências de símbolos para cada slot
function generateSymbolSequences(finalResult) {
  const sequences = [];

  for (let i = 0; i < slotCount; i++) {
    const framesBeforeStop = spinFrames[i];
    const symbolsInScroll = Math.ceil((framesBeforeStop * initialScrollSpeed) / symbolSize) + 5;

    const slotSequence = [];
    for (let j = 0; j < symbolsInScroll; j++) {
      slotSequence.push(getRandomSymbol());
    }

    slotSequence.push(finalResult[i]); // Adiciona o resultado final
    sequences.push(slotSequence);
  }

  return sequences;
}

// 🖼️ Cria buffer de fundo sem linhas verticais
function createBackgroundBuffer(images) {
  const bgCanvas = createCanvas(size, size);
  const bgCtx = bgCanvas.getContext('2d');

  bgCtx.drawImage(images.background, 0, 0, size, size);

  return bgCanvas;
}

// 🎨 Desenha um frame
function drawFrame(ctx, bgBuffer, images, currentFrame, sequences) {
  ctx.drawImage(bgBuffer, 0, 0);

  const slotWidth = size / slotCount;

  for (let i = 0; i < slotCount; i++) {
    const centerX = (i + 0.5) * slotWidth;
    const spinDuration = spinFrames[i];
    const sequence = sequences[i];

    if (currentFrame < spinDuration) {
      const transitionStart = spinDuration - transitionFrames;
      let offsetY;

      if (currentFrame >= transitionStart) {
        const progress = (currentFrame - transitionStart) / transitionFrames;
        offsetY = easeOutCubic(progress) * symbolSize;
      } else {
        offsetY = (currentFrame * initialScrollSpeed) % symbolSize;
      }

      const totalShift = Math.floor((currentFrame * initialScrollSpeed) / symbolSize);

      for (let j = -2; j <= 3; j++) {
        const symbolIndex = (totalShift + j + sequence.length) % sequence.length;
        const symbol = sequence[symbolIndex];
        const yPos = (size / 2) + (j * symbolSize) - offsetY;

        ctx.drawImage(images[symbol], centerX - symbolSize / 2, yPos - symbolSize / 2, symbolSize, symbolSize);
      }
    } else {
      const symbol = sequence[sequence.length - 1];
      ctx.drawImage(images[symbol], centerX - symbolSize / 2, size / 2 - symbolSize / 2, symbolSize, symbolSize);
    }
  }
}

/**
 * Gera um GIF animado de slot machine.
 * @param {string[]} finalResult - Array de 3 emojis que serão os símbolos finais.
 * @returns {Promise<Buffer>} - Buffer com o GIF gerado.
 */
export async function generateSlotSpinGif(finalResult = ['💎', '💎', '💎']) {
  if (!Array.isArray(finalResult) || finalResult.length !== slotCount) {
    throw new Error(`finalResult precisa ser um array de ${slotCount} emojis.`);
  }

  const images = await loadSymbolImages();

  const encoder = new GIFEncoder(size, size);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(delay);
  encoder.setQuality(10);

  const maxFrames = Math.max(...spinFrames);
  const holdFrames = Math.ceil(1000 / delay); // Segura o resultado final por 1 segundo

  const sequences = generateSymbolSequences(finalResult);
  const bgBuffer = createBackgroundBuffer(images);

  for (let frame = 0; frame <= maxFrames + holdFrames; frame++) {
    drawFrame(ctx, bgBuffer, images, frame, sequences);
    encoder.addFrame(ctx);
  }

  encoder.finish();

  return encoder.out.getData();
}
