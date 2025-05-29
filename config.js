import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

//══════════ ❏ DONO E BOT ❏ ══════════//
global.pairing = '5511999999999' // Número do bot (sem o @s.whatsapp.net)
global.owner = [['5511915176928', 'Jeann', true]] // Lista de donos: [número, nome, prioridade]
global.mods = [] // Moderadores
global.namebot = 'Lynx by skylynxcloud.com' //Nome do Bot
global.prefix = '.'

//══════════ ❏ FIGURINHAS E MARCAS ❏ ══════════//
global.stickpack = `Sticker Criado por ${namebot}\n` // Nome do pacote de figurinhas
global.stickauth = `© LynxBot by skylynxcloud.com` // Autor das figurinhas
global.sig = 'https://www.instagram.com/imisobot' // Link para Instagram
global.sfb = 'https://www.facebook.com/' // Link para Facebook
global.watermark = '© LynxBot by skylynxcloud.com' // Márca D'água
global.wm = watermark // Márca D'água 2
global.sgw = 'https://skylynxcloud.com' // Recado
global.sgc = 'https://whatsapp.com/channel/00' // Canal do Bot
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
global.readMore = readMore

//══════════ ❏ API KEYS E SERVIÇOS ❏ ══════════//
global.APIs = {
    // Suas APIs externas podem ser listadas aqui
}

global.APIKeys = {
    // Suas chaves de APIs externas correspondentes
}
global.thumbnailUrl = ['https://i.ibb.co/HDdvpMhk/Frame-1.jpg'] // Thumbnail Canvas do Menu



global.welcome_text = '❖━━━━━━[ Bem-Vindo(a) ]━━━━━━❖\n\n┏––––––━━━━━━━━•\n│☘︎ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Olá @user)\n├[ Apresentação ]—\n│ NOME: \n│ IDADE: \n│ GÊNERO:\n┗––––––━━┅┅┅\n\n––––––┅┅ DESCRIÇÃO ┅┅––––––\n@desc'
global.bye = '❖━━━━━━[ Saiu do Grupo ]━━━━━━❖\nAdeus @user 👋😃'
global.spromote = '@user agora é administrador!'
global.sdemote = '@user não é mais administrador!'
global.sDesc = 'A descrição do grupo foi alterada para:\n@desc'
global.sSubject = 'O nome do grupo foi alterado para:\n@subject'
global.sIcon = 'O ícone do grupo foi alterado!'
global.sRevoke = 'O link do grupo foi redefinido para:\n@revoke'
global.sAnnounceOn = 'O grupo foi *fechado!*\nAgora apenas administradores podem enviar mensagens.'
global.sAnnounceOff = 'O grupo foi *aberto!*\nAgora todos os participantes podem enviar mensagens.'
global.sRestrictOn = 'Permissões de edição de informações do grupo alteradas para *apenas administradores*!'
global.sRestrictOff = 'Permissões de edição de informações do grupo alteradas para *todos os participantes*!'

//////////\\\\\\\\\\//////////\\\\\\\\\\
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})