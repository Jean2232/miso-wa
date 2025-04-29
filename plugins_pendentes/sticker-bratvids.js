import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) throw '❌ Informe um texto válido para gerar a figurinha animada.';

  try {
    let url = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text.trim())}`;

    // Busca o vídeo da API
    let res = await fetch(url);
    if (!res.ok) throw `🚫 Erro ao buscar mídia da API. Código: ${res.status}`;

    let videoBuffer = await res.buffer();

    // Gera figurinha
    let stiker = await sticker(videoBuffer, null, global.stickpack, global.stickauth);
    await conn.sendFile(m.chat, stiker, null, { asSticker: true }, m);

  } catch (err) {
    console.error('Erro no bratvid:', err.message || err);
    await conn.sendMessage(m.chat, {
      text: `❌ Erro ao gerar figurinha:\n${err.message || 'Erro desconhecido.'}`
    }, { quoted: m });
  }
};

handler.help = ['bratvid <texto>']
handler.tags = ['sticker']
handler.command = /^(bratvid|bratvids|bratvideo)$/i
handler.register = true

export default handler
