let handler = async (m) => {
	if (!m.quoted) return m.reply("❌ Responda uma imagem ou vídeo que seja visualização única")
  
	let tiposSuportados = ["image/jpeg", "video/mp4"]
	let tipoValido = tiposSuportados.includes(m.quoted.mimetype)
	let isViewOnce = m.quoted?.viewOnce === true
  
	if (tipoValido && isViewOnce) {
	  let msg = await m.getQuotedObj()?.message
	  let tipo = Object.keys(msg)[0]
	  let midia = await m.quoted?.download() || await m.getQuotedObj().download()
  
	  if (!midia) return m.reply("❌ Falha ao obter mídia.")
  
	  await conn.sendFile(
		m.chat,
		midia,
		'arquivo.mp4',
		msg[tipo]?.caption || '',
		m
	  )
	} else {
	  m.reply("❌ Isso não é uma mensagem de visualização única.")
	}
  }
  
  handler.help = ['read <visualização única>', 'revelar <visualização única>']
  handler.tags = ['tools']
  handler.command = /^read|revelar$/i
  handler.register = true
  
  export default handler
  