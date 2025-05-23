import { promises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = join(__dirname, '../tmp', +new Date() + '.' + ext);
      let out = tmp + '.' + ext2;
      await promises.writeFile(tmp, buffer);
      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ]);
      ffmpegProcess.on('error', (err) => {
        console.error('Error spawning ffmpeg:', err);
        reject(err);
      });
      ffmpegProcess.on('close', async (code) => {
        try {
          await promises.unlink(tmp);
          if (code !== 0) return reject(code);
          if (!await promises.access(out).then(() => true).catch(() => false)) {
            return reject(new Error('Output file not found'));
          }
          resolve({
            data: await promises.readFile(out),
            filename: out,
            delete() {
              return promises.unlink(out);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg');
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

function toMP3(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ar', '44100',
    '-ac', '2',
    '-b:a', '192k'
  ], ext, 'mp3');
}

function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4');
}

export {
  toAudio,
  toPTT,
  toMP3,
  toVideo,
  ffmpeg
};
