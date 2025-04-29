import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) throw 'Insira um texto válido!';

  try {
    let url = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text.trim())}`;

    // Buscar imagem
    let res = await fetch(url);
    if (!res.ok) throw `Falha ao obter a imagem da API! Status: ${res.status}`;

    // Obter buffer da imagem
    let imageBuffer = await res.buffer();

    // Criar figurinha usando o buffer da imagem
    let stiker = await sticker(imageBuffer, null, global.stickpack, global.stickauth);
    await conn.sendFile(m.chat, stiker, null, { asSticker: true }, m);

  } catch (err) {
    console.error('Erro:', err.message || err);
    await conn.sendMessage(m.chat, { text: `Erro: ${err.message || 'Falha ao obter a imagem.'}` }, { quoted: m });
  }
};

handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^(brat)$/i

export default handler

