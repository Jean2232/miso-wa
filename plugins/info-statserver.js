import { performance } from 'perf_hooks'
import osu from 'node-os-utils'

let handler = async (m, { conn, command, usedPrefix, DevMode }) => {
    try {
        let NotDetect = 'Não detectado'
        let old = performance.now()
        let cpu = osu.cpu
        let cpuCore = cpu.count()
        let drive = osu.drive
        let mem = osu.mem
        let netstat = osu.netstat
        let OS = osu.os.platform()
        let cpuModel = cpu.model()
        let cpuPer

        let p1 = cpu.usage().then(cpuPercentage => {
            cpuPer = cpuPercentage
        }).catch(() => {
            cpuPer = NotDetect
        })

        let driveTotal, driveUsed, drivePer
        let p2 = drive.info().then(info => {
            driveTotal = (info.totalGb + ' GB')
            driveUsed = info.usedGb
            drivePer = (info.usedPercentage + '%')
        }).catch(() => {
            driveTotal = NotDetect
            driveUsed = NotDetect
            drivePer = NotDetect
        })

        let ramTotal, ramUsed
        let p3 = mem.info().then(info => {
            ramTotal = info.totalMemMb
            ramUsed = info.usedMemMb
        }).catch(() => {
            ramTotal = NotDetect
            ramUsed = NotDetect
        })

        let netsIn, netsOut
        let p4 = netstat.inOut().then(info => {
            netsIn = (info.total.inputMb + ' MB')
            netsOut = (info.total.outputMb + ' MB')
        }).catch(() => {
            netsIn = NotDetect
            netsOut = NotDetect
        })

        await Promise.all([p1, p2, p3, p4])
        let _ramTotal = (ramTotal + ' MB')
        let neww = performance.now()

        let txt = `
*「 Monitoramento do Bot 」*

📀 *Sistema Operacional:* ${OS}
⚙️ *Modelo do CPU:* ${cpuModel}
🧠 *Núcleos:* ${cpuCore} núcleos
🔥 *Uso da CPU:* ${cpuPer}%
🧮 *RAM:* ${ramUsed} / ${_ramTotal} (${/[0-9.+/]/g.test(ramUsed) && /[0-9.+/]/g.test(ramTotal) ? Math.round(100 * (ramUsed / ramTotal)) + '%' : NotDetect})
💾 *Disco:* ${driveUsed} / ${driveTotal} (${drivePer})
📡 *Ping:* ${Math.round(neww - old)} ms
📥 *Internet IN:* ${netsIn}
📤 *Internet OUT:* ${netsOut}
`

        conn.sendMessage(m.chat, {
            image: { url: "https://i.ibb.co/rKkNy3cG/Frame-13.png" },
            caption: txt
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '❌ Ocorreu um erro ao obter o status.', m)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, `Erro em status.js\nNúmero: *${m.sender.split('@')[0]}*\nComando: *${m.text}*\n\n${e}`, m)
            }
        }
    }
}

handler.help = ['status']
handler.tags = ['info']
handler.command = /^(status)$/i

export default handler
