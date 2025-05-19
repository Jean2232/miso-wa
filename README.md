# 🤖 Bot WhatsApp Multi-Funções — Documentação

Este projeto é um bot para WhatsApp com suporte a múltiplos comandos, incluindo IA, download de mídias, ferramentas de imagem, segurança de grupo e muito mais. Desenvolvido para ser modular e facilmente expandível.

---

## ⚙️ Requisitos

- Node.js 16 ou superior
- `ffmpeg`, `imagemagick` (para funções de imagem e stickers)
- Banco de dados local (`database.json`)
- Dependências instaladas via `npm install`

---

## 📁 Estrutura de Pastas

```
├── plugins/              # Comandos modulares do bot
├── lib/                  # Funções auxiliares (ex: upload, sticker, converter)
├── tmp/                  # Arquivos temporários
├── src/                  # Avatares e assets fixos
├── database.json         # Banco de dados persistente
├── config.js             # Configurações principais
├── handler.js            # Manipulador de mensagens
├── index.js              # Inicializador do bot
└── main.js               # Lógica principal e recarregamento
```

---

## 🧩 Comandos Principais

### 🔹 IA
- `.blackbox` — Consulta IA Blackbox
- `.copilot` — Planejamento com IA de viagem
- `.gemma` — IA Gemma 2 9B (Google)
- `.llama` — IA LLaMA 3 8B
- `.gemini` — Gemini 1.5 Pro
- `.gptsearch` — Busca com IA e Web

### 🔹 Downloads
- `.multidl` — Baixa vídeo de várias fontes (TikTok, IG, YT, FB, etc)
- `.ttkdl`, `.fbdl`, `.igdl`, etc — Alternativas separadas por plataforma

### 🔹 Ferramentas
- `.ocr` — Reconhece texto de imagem
- `.qr` — Gera QR Code
- `.read` — Lê mensagens view-once
- `.ci` — Identifica canal de mensagem
- `.blur` — Aplica desfoque em imagem
- `.stalk` — Consulta perfil do WhatsApp

### 🔹 Segurança e Controle
- `.antifake` — Remove números com DDI indesejado
- `.antipv` — Bloqueia mensagens privadas
- `.owneronly` — Restringe uso apenas ao dono
- `.kick` — Remove usuário mencionado

---

## 📦 Instalação de Dependências

```bash
npm install
npm install nayan-videos-downloader
```

---

## 📝 Configuração

Edite o arquivo `config.js` com suas credenciais e preferências.

---

## 🧠 Dicas

- Os plugins podem ser atualizados ou desativados simplesmente movendo os arquivos na pasta `plugins/`.
- O banco `database.json` é atualizado automaticamente, mas deve ser salvo com `global.db.write()` para persistência.

---

## 👤 Autor

Desenvolvido por Jean com base no framework Nao-MD.

---