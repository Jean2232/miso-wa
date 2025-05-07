import { tmpdir } from 'os'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {

  const tmp = [tmpdir(), join(__dirname, '../tmp')];
  const filenames = [];

  tmp.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      filenames.push(join(dirname, file));
    });
  });

  const deletedFiles = [];

  filenames.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  conn.reply(m.chat, 'Sucesso!', m);

  if (deletedFiles.length > 0) {
    conn.reply(m.chat, `Arquivos deletados`, m)
  }

  if (deletedFiles.length == 0) {
    conn.reply(m.chat, 'Não há arquivos restantes em tmp', m);
  }
}

handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp|clear|tmpclear|cleantmp)$/i
handler.rowner = true

export default handler
