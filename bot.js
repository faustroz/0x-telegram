require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Perbaikan: Gunakan readdirSync agar bisa langsung membaca file
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));

commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  bot.onText(command.pattern, (msg, match) => command.execute(bot, msg, match));
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "User";

  const welcomeMessage = `
🌟 *Halo ${firstName}!* Selamat datang di *0x Bot* 🚀  

Saya adalah bot yang siap membantu kamu membuat *QR code* dengan cepat dan mudah! 🎯  

Yuk, mulai dengan cara berikut:   

✨ *Buat QR Code:*  
Kirim perintah:  
\`/qr TeksAtauURLAnda\`  

💡 *Contoh:*  
\`/qr https://contoh.com\`  

🤖 *Dibuat oleh Made Ferdy Diatmika*  
`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

console.log("Bot has been running...");
