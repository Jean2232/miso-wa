import fetch from 'node-fetch'

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `*Exemplo:* ${usedPrefix + command} 112.90.150.204`;
  try {
    let res = await fetch(`https://ipwho.is/${text}`).then(result => result.json());
    await conn.sendMessage(m.chat, { location: { degreesLatitude: res.latitude, degreesLongitude: res.longitude }},{ ephemeralExpiration: 604800 });
    await delay(2000);
    conn.reply(m.chat, JSON.stringify(res, null, 2), m);  
  } catch (e) { 
    throw { error: `IP ${text} não encontrado!` };
  }
}

handler.command = handler.help = ['ip']
handler.tags = ['tools']

handler.limit = true
handler.register = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}