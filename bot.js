require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const botName = "Rendezvous Bot"; // Ganti dengan nama bot yang sesuai

// Load command files
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  bot.onText(command.pattern, (msg, match) => command.execute(bot, msg, match));
});

// /start Command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "User";

  const welcomeMessage = `
🌟 *Halo, ${firstName}!* Selamat datang di *${botName}* 🚀  

Saya adalah bot yang siap membantu berbagai kebutuhanmu!  

Ketik \`/usage\` untuk melihat daftar fitur yang tersedia.  

📌 Dibuat oleh *Made Ferdy Diatmika*  
`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

// /usage Command
bot.onText(/\/usage/, (msg) => {
  const chatId = msg.chat.id;

  const usageMessage = `
📌 *Daftar Perintah ${botName}*  

🔹 \`/shorten [URL]\` – Perpendek URL  
🔹 \`/qr [text]\` – Buat QR Code  
🔹 \`/calc [expression]\` – Kalkulator  
🔹 \`/weather [city]\` – Cek cuaca  
🔹 \`/news\` – Berita terbaru  
🔹 \`/help\` – Bantuan lebih lanjut  

✨ *Gunakan perintah di atas untuk mulai!*  
`;

  bot.sendMessage(chatId, usageMessage, { parse_mode: "Markdown" });
});

console.log("Bot has been running...");
