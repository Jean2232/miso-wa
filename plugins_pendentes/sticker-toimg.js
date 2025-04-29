import sharp from 'sharp'
import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `Responda a uma figurinha com o comando *${usedPrefix + command}*`;

  if (!m.quoted) throw notStickerMessage;

  const q = m.quoted || m;
  const mime = q.mimetype || '';

  if (!/image\/webp/.test(mime)) {
    try {
      const name = await conn.getName(m.sender);
      const media = await q.download();
      const out = await webp2png(media).catch(_ => null) || Buffer.alloc(0);
      await conn.sendFile(m.chat, out, 'out.png', 'Solicitado por ' + name, m);

      if (fs.existsSync(out || 'out.png' || './tmp/out.png' || `./tmp/${out}`)) {
        await fs.promises.unlink(out || 'out.png' || './tmp/out.png' || `./tmp/${out}`);
      }
    } catch (error) {
      console.error(error);
      m.reply(`Ocorreu um erro: ${notStickerMessage}`);
    }
  } else {
    try {
      const media = await q.download();
      m.reply('Aguarde, convertendo figurinha em imagem...');

      const decodedBuffer = await sharp(media).toFormat('png')
        .png({ quality: 100, progressive: true, compressionLevel: 9 })
        .toBuffer();

      if (decodedBuffer.length > 0) {
        await conn.sendFile(m.chat, decodedBuffer, 'out.png', '*Pronto!*', m);

        if (fs.existsSync('out.png' || './tmp/out.png')) {
          await fs.promises.unlink('out.png' || './tmp/out.png');
        }
      } else {
        throw 'Falha ao converter a figurinha em imagem.';
      }
    } catch (error) {
      console.error(error);
      if (error.message.includes('Timeout')) {
        m.reply('O processo demorou muito. Tente novamente.');
      } else {
        m.reply(`Ocorreu um erro: ${notStickerMessage}`);
      }
    }
  }
};

handler.help = ['toimg (sticker)', 'img (sticker)']
handler.tags = ['sticker']
handler.command = ['toimg', 'img']

handler.register = true
handler.limit = true

export default handler
