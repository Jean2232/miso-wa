import axios from "axios";
import crypto from "crypto";
import UserAgent from "user-agents";
import yts from "yt-search";

const savetube = {
  api: {
    base: 'https://media.savetube.me/api',
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    accept: '*/*',
    'content-type': "application/json",
    origin: "https://yt.savetube.me",
    referer: 'https://yt.savetube.me/',
    'user-agent': new UserAgent().toString(),
    'x-forwarded-for': `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  },
  formats: ["144", "240", "360", "480", "720", "1080", "mp3"],
  crypto: {
    hexToBuffer: hex => Buffer.from(hex.match(/.{1,2}/g).join(''), 'hex'),
    decrypt: async payloadB64 => {
      const f = Buffer.from(payloadB64, 'base64');
      const iv = f.slice(0, 16);
      const data = f.slice(16);
      const key = savetube.crypto.hexToBuffer('C5D58EF67A7584E4A29F6C35BBC4EB12');
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
      return JSON.parse(decrypted.toString());
    }
  },
  isUrl: str => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  },
  youtubeId: url => {
    if (!url) return null;
    const patterns = [
      /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/v\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
      /youtu\.be\/([A-Za-z0-9_-]{11})/
    ];
    for (let re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    return null;
  },
  request: async (path, data = {}, method = "post") => {
    try {
      const url = path.startsWith('http') ? path : `${savetube.api.base}${path}`;
      const res = await axios({
        method,
        url,
        headers: savetube.headers,
        ...(method === 'post' ? { data } : { params: data })
      });
      return { status: true, response: res.data };
    } catch (err) {
      return {
        status: false,
        code: err.response?.status || 500,
        error: `Request error: ${err.message}`
      };
    }
  },
  getCDN: async () => {
    const r = await savetube.request(savetube.api.cdn, {}, 'get');
    return r.status ? { status: true, cdn: r.response.cdn } : r;
  },
  download: async (videoUrl, q) => {
    if (!videoUrl) {
      return { status: false, error: "No URL provided." };
    }
    if (!savetube.isUrl(videoUrl)) {
      return { status: false, error: "Invalid URL." };
    }
    if (!savetube.formats.includes(q)) {
      return { status: false, error: `Formato inválido. Use um de: ${savetube.formats.join(', ')}` };
    }
    const vid = savetube.youtubeId(videoUrl);
    if (!vid) {
      return { status: false, error: "Não foi possível extrair o ID do YouTube." };
    }

    const cdnRes = await savetube.getCDN();
    if (!cdnRes.status) return cdnRes;
    const cdn = cdnRes.cdn;

    const infoRes = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=$${vid}` });
    if (!infoRes.status) return infoRes;
    if (!infoRes.response?.data) {
      return { status: false, error: "Dados de resposta ausentes para descriptografar." };
    }

    const info = await savetube.crypto.decrypt(infoRes.response.data);

    const qualityParam = q === 'mp3' ? '128' : q;

    const dlRes = await savetube.request(`https://${cdn}${savetube.api.download}`, {
      id: vid,
      downloadType: q === 'mp3' ? 'audio' : 'video',
      quality: qualityParam,
      key: info.key
    });
    if (!dlRes.status) return dlRes;

    // corrige URL caso ainda venha com /mp3/
    let downloadUrl = dlRes.response.data.downloadUrl;
    if (q === 'mp3') {
      downloadUrl = downloadUrl.replace('/mp3/', '/128/');
    }

    return {
      status: true,
      response: {
        title:    info.title,
        type:     q === 'mp3' ? 'audio' : 'video',
        format:   q,
        thumbnail: info.thumbnail || `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`,
        url:      downloadUrl,
        id:       vid,
        key:      info.key,
        duration: info.duration,
        quality:  qualityParam
      }
    };
  }
};

export async function ytdl(url, quality = '720') {
  if (!['144', '240', '360', '480', '720', '1080'].includes(quality)) {
    return { status: false, error: "Qualidade inválida. Use '144', '240', '360', '480', '720' ou '1080'." };
  }
  return await savetube.download(url, quality);
}

export async function ytdltxt(query, quality = '720') {
  const r = await yts(query);
  if (!r.videos.length) {
    return { status: false, error: "Nenhum vídeo encontrado." };
  }
  return await ytdl(r.videos[0].url, quality);
}

export async function ytdlaud(url) {
  return await savetube.download(url, 'mp3');
}

export async function ytdlaudtxt(query) {
  const r = await yts(query);
  if (!r.videos.length) {
    return { status: false, error: "Nenhum vídeo encontrado." };
  }
  return await ytdlaud(r.videos[0].url);
}
