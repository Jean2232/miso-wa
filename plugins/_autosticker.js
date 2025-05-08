 // Auto Sticker
 import webp from 'node-webpmux'
 import { sticker } from '../lib/sticker.js'
 import { Sticker } from 'wa-sticker-formatter'
 import * as crypto from 'crypto'
 
 let handler = m => m
 handler.before = async function(m) {

     async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
         const img = new webp.Image();
         const stickerPackId = crypto.randomBytes(32).toString('hex');
         const json = {
             'sticker-pack-id': stickerPackId,
             'sticker-pack-name': packname,
             'sticker-pack-publisher': author,
             'emojis': categories,
             ...extra
         };

         const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
         const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
         const exif = Buffer.concat([exifAttr, jsonBuffer]);
         exif.writeUIntLE(jsonBuffer.length, 14, 4);

         await img.load(webpSticker);
         img.exif = exif;
         return img.save(null);
     }
     if (m.isGroup && global.db.data.chats[m.chat].autoSticker) {
         if (m.fromMe || m.mtype === 'stickerMessage') return
         if (m.quoted || m.mtype === 'stickerMessage') return
         let q = (m.quoted && /image|video/.test((m.quoted.msg || m.quoted).mimetype || '')) ? m.quoted : m
         let mime = (q.msg || q).mimetype || q.mediaType || ''
         if (/image|video/.test(mime)) {
             try {
                 let img = await q.download?.()
                 if (!img) return

                 let stiker = false
                 if (/video/.test(mime)) {
                     if ((q.msg || q).seconds > 10) return
                     try {
                         stiker = await sticker(img, false, global.stickpack, global.stickauth)
                     } catch (e) {
                         console.error(e)
                         return
                     }
                 } else if (/image/.test(mime)) {
                     try {
                         stiker = await addExif(img, global.stickpack, global.stickauth)
                     } catch (e) {
                         console.error(e)
                         stiker = await (new Sticker(img, {
                             type: 'full',
                             pack: global.stickpack,
                             author: global.stickauth
                         })).toBuffer()
                     }
                 }

                 if (stiker) {
                     return await this.sendFile(m.chat, stiker, 'sticker.webp', '', m, null)
                 }

             } catch (e) {
                 console.error(e)
             }
             return null
         }
     }
 }

 export default handler;