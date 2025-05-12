import yargs from 'yargs';
import cfonts from 'cfonts';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { createInterface } from 'readline';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';

// Setup console output
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);
const __dirname = dirname(fileURLToPath(import.meta.url));
import { wchks } from './lib/wchk.js';
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, './package.json'));

say('Miso-Wa\nv2.0.1', { font: 'chrome', align: 'center', gradient: ['red', 'magenta'] });
say(`'${name}' By @${author.name || author}`, { font: 'console', align: 'center', gradient: ['red', 'magenta'] });
say('dark-hosting.com', { font: 'chrome', align: 'center', gradient: ['red', 'magenta'] });
console.log('Iniciando...'); 

var isRunning = false;
await wchks();

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];
  say([process.argv[0], ...args].join(' '), { font: 'console', align: 'center', gradient: ['red', 'magenta'] });
  
  setupMaster({ exec: args[0], args: args.slice(1) });
  let p = fork();

  p.on('message', data => {
    console.log('[✅Recebida]', data);
    switch (data) {
      case 'reset':
        p.kill(); // Change here
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
      default:
          console.warn('[⚠️ Mensagem não reconhecida]', data);
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('[❗] Falha com o codigo:', code);
    if (code !== 0) {
      console.log('Reiniciando');
      return start(file);
    }
    
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });

  let opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  
  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim());
      });
    }
  }
}

start('main.js');
