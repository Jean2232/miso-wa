import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas"
import path from "path"
import { fileURLToPath } from "url"

// __dirname em ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

globalThis.GlobalFonts = GlobalFonts
GlobalFonts.registerFromPath(
  path.join(__dirname, "../src/font/Montserrat-Black.ttf"),
  "montserrat-black"
)
GlobalFonts.registerFromPath(
  path.join(__dirname, "../src/font/Montserrat-ExtraLight.ttf"),
  "montserrat-extra-light"
)

const defaultAssets = {
  background: "https://raw.githubusercontent.com/oneofremii/Welcomify/main/assets/background.png"
}

export class Card {
  constructor(options) {
    this.username   = options?.username
    this.avatar     = options?.avatar
    this.title      = options?.title
    this.color      = options?.color
    this.message    = options?.message
    this.background = options?.background
  }

  setName(name)        { this.username   = name;    return this }
  setAvatar(img)       { this.avatar     = img;     return this }
  setTitle(t)          { this.title      = t;       return this }
  setColor(c)          { this.color      = c;       return this }
  setMessage(msg)      { this.message    = msg;     return this }
  setBackground(bg)    { this.background = bg;      return this }

  async build() {
    if (!this.username) throw new Error("Provide username to display on card")
    if (!this.avatar)   throw new Error("Provide valid avatar url of user")
    if (!this.title)    this.setTitle("WELCOME")
    if (!this.color)    this.setColor("00FF38")
    if (!this.message)  throw new Error("Provide message to display on card")
    if (!this.background) this.setBackground(defaultAssets.background)

    if (this.username.length >= 16)
      throw new Error("The username is too long to display on card [<= 15]")
    if (this.title.length >= 16)
      throw new Error("The title is too long to display on card [<= 15]")
    if (this.message.length >= 36)
      throw new Error("The message is too long to display on card [<= 35]")

    const canvasWidth  = 1280
    const canvasHeight = 720
    const centerX = 900
    const centerY = 500

    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx    = canvas.getContext("2d")

    // BACKGROUND
    const bgImage = await loadImage(this.background)
    const scale   = Math.max(canvasWidth / bgImage.width, canvasHeight / bgImage.height)
    const imgW    = bgImage.width  * scale
    const imgH    = bgImage.height * scale
    const imgX    = (canvasWidth  - imgW) / 2
    const imgY    = (canvasHeight - imgH) / 2
    ctx.drawImage(bgImage, imgX, imgY, imgW, imgH)

    // TEXT: username, title, message (solid color)
    ctx.textAlign = "center"
    ctx.fillStyle = `#E3E3E3`
    ctx.font      = `72px montserrat-black`
    ctx.fillText(this.username.toUpperCase(), centerX, centerY + 30)

    ctx.fillStyle = `#1210D0`
    ctx.font      = `48px montserrat-black`
    ctx.fillText(this.title.toUpperCase(), centerX, centerY + 100)

    ctx.fillStyle = `#E3E3E3`
    ctx.font      = `41px montserrat-extra-light`
    ctx.fillText(this.message.toUpperCase(), centerX, centerY + 250)

    // AVATAR (sem sombra)
   await loadImage(this.avatar).then((image) => {
      const avatarX = 768
      const avatarY = 195
      ctx.beginPath();
      ctx.arc(avatarX + 130, avatarY + 130, 130, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(image, avatarX, avatarY, 260, 260);
    });

    return canvas.toBuffer("image/png")
  }
}
