
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js'

import path, { join } from 'path'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs'
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv;
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { tmpdir } from 'os'
import readline from 'readline'
import { format } from 'util'
import pino from 'pino'
import ws from 'ws'
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore, PHONENUMBER_MCC } = await import('@adiwajshing/baileys')
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import cloudDBAdapter from './lib/cloudDBAdapter.js'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
const { CONNECTING } = ws
const { chain } = lodash

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
      (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!db.READ) {
      clearInterval(this)
      resolve(db.data == null ? global.loadDatabase() : db.data)
    }
  }, 1 * 1000))
  if (db.data !== null) return
  db.READ = true
  await db.read().catch(console.error)
  db.READ = null
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {})
  }
  global.db.chain = chain(db.data)
}
loadDatabase()

  setInterval(async () => {
      if (global.db.data) await global.db.write().catch(console.error)
      clearTmp()
    }, 60 * 1000)
    
const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')
const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  printQRInTerminal: !usePairingCode,
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store'
    })),
  },
  getMessage: async key => {
    const messageData = await store.loadMessage(key.remoteJid, key.id);
    return messageData?.message || undefined;
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(
      message.buttonsMessage
      || message.templateMessage
      || message.listMessage
    );
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }

    return message;
  },
  connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, generateHighQualityLinkPreview: true, syncFullHistory: true, markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

if (usePairingCode && !conn.authState.creds.registered) {
  if (useMobile) throw new Error('Cannot use pairing code with mobile api')
  const { registration } = { registration: {} }
  let phoneNumber = global.pairing
  console.log(chalk.bgWhite(chalk.blue('Generating code...')))
  setTimeout(async () => {
    let code = await conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join('-') || code
    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
  }, 3000)
}

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
    return false
  })
}

async function connectionUpdate(update) {
  const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;

  if (isNewLogin) {
    conn.isInit = true;
  }

  if (connection == 'connecting') {
    console.log(chalk.redBright('⚡ Ativando o Bot, por favor aguarde......'));
  } else if (connection == 'open') {
    console.log(chalk.green('✅ Conectado'));
  }

  if (isOnline == true) {
    console.log(chalk.green('Status: Ativo'));
  } else if (isOnline == false) {
    console.log(chalk.red('Status: Inativo'));
  }

  if (receivedPendingNotifications) {
    console.log(chalk.yellow('Aguardando novas mensagens'));
  }

  if (connection == 'close') {
    console.log(chalk.red('⏱️ Conexão perdida. Tentando reconectar......'));
  }

  global.timestamp.connect = new Date;

  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== CONNECTING) {
    console.log(await global.reloadHandler(true));
  }

  if (global.db.data == null) {
    await global.loadDatabase();
  }
}

process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = global.welcome_text
  conn.bye = global.bye_text
  conn.spromote = global.spromote_text
  conn.sdemote = global.sdemote_text
  conn.sDesc = global.sDesc_text
  conn.sSubject = global.sSubject_text
  conn.sIcon = global.sIcon_text
  conn.sRevoke = global.sRevoke_text
  conn.sAnnounceOn = global.sAnnounceOn_text
  conn.sAnnounceOff = global.sAnnounceOff_text
  conn.sRestrictOn = global.sRestrictOn_text
  conn.sRestrictOff = global.sRestrictOff_text
  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  conn.ev.on('call', async (call) => {
    console.log('Chamada recebida:', call);
    if (call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Chamada rejeitada');
    }
  })
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true

}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

// Quick Test

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127);
        });
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false));
      })
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  console.log(test);

  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };

  Object.freeze(global.support);

  if (!s.ffmpeg) {
    conn.logger.warn(`Por favor, instale o ffmpeg primeiro para que seja possível enviar vídeos.`);
  }
  
  if (s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Os stickers podem não ser animados sem a biblioteca libwebp no ffmpeg (--enable-libwebp ao compilar o ffmpeg).');
  }
  
  if (!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('A funcionalidade de stickers pode não funcionar corretamente. O ImageMagick ou libwebp no ffmpeg não estão instalados (pkg install imagemagick).');
  }
}

_quickTest()
  .then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json'))
  .catch(console.error);
