import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

//══════════ ❏ DONO E BOT ❏ ══════════//
global.pairing = '5511963038470' // Número do bot (sem o @s.whatsapp.net)
global.owner = [['5511915176928', 'Jeann', true]] // Lista de donos: [número, nome, prioridade]
global.mods = [] // Moderadores
global.namebot = 'Miso by dark-hosting.com' //Nome do Bot
global.prefix = '.'

//══════════ ❏ FIGURINHAS E MARCAS ❏ ══════════//
global.stickpack = `Sticker Criado por ${namebot}\nlinktr.ee/amisobot` // Nome do pacote de figurinhas
global.stickauth = `© Miso-MD pwrd by dark-hosting.com` // Autor das figurinhas
global.sig = 'https://www.instagram.com/imisobot' // Link para Instagram
global.sfb = 'https://www.facebook.com/' // Link para Facebook
global.watermark = '© Miso-MD pwrd by dark-hosting.com' // Márca D'água
global.wm = watermark // Márca D'água 2
global.sgw = 'https://dark-hosting.com' // Recado
global.sgc = 'https://whatsapp.com/channel/00' // Canal do Bot

//══════════ ❏ API KEYS E SERVIÇOS ❏ ══════════//
global.APIs = {
    // Suas APIs externas podem ser listadas aqui
}

global.APIKeys = {
    // Suas chaves de APIs externas correspondentes
}
global.thumbnailUrl = ['https://i.ibb.co/HDdvpMhk/Frame-1.jpg'] // Thumbnail Canvas do Menu

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})