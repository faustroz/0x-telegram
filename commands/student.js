const QRCode = require("qrcode");
const fs = require("fs");
const TinyURL = require("tinyurl");
const { evaluate } = require("mathjs");

module.exports = {
  pattern: /^\/qr (.+)$/,
  execute: async (bot, msg, match) => {
    const chatId = msg.chat.id;
    const textToConvert = match[1];
    const filePath = "qrcode.png";

    try {
      await QRCode.toFile(filePath, textToConvert);

      await bot.sendPhoto(chatId, filePath, {
        caption: `✅ QR Code for: ${textToConvert}\n\n🤖 Bot by Made Ferdy Diatmika`,
      });

      fs.unlinkSync(filePath);s
    } catch (err) {
      bot.sendMessage(chatId, "❌ Failed to generate QR Code.");
      console.error(err);
    }
  },
};

// shorten
module.exports = {
  pattern: /^\/shorten (.+)$/,
  execute: async (bot, msg, match) => {
    const chatId = msg.chat.id;
    const urlToShorten = match[1];

    if (!urlToShorten.startsWith("http")) {
      bot.sendMessage(chatId, "❌ Please enter a valid URL! Example: `/shorten https://google.com`", { parse_mode: "Markdown" });
      return;
    }

    try {
      const shortUrl = await TinyURL.shorten(urlToShorten);
      bot.sendMessage(chatId, `✅ Link successfully shortened:\n🔗 ${shortUrl}`);
    } catch (err) {
      bot.sendMessage(chatId, "❌ Failed to shorten URL. Please try again later!");
      console.error(err);
    }
  },
};

// Calc
module.exports = {
  pattern: /\/calc (.+)/,
  execute: (bot, msg, match) => {
    const chatId = msg.chat.id;
    const expression = match[1];

    try {
      const result = evaluate(expression);
      bot.sendMessage(chatId, `📊 *Hasil:* \`${expression} = ${result}\``, {
        parse_mode: "Markdown",
      });
    } catch (error) {
      bot.sendMessage(chatId, "⚠️ *Ekspresi tidak valid!* Pastikan format yang digunakan benar.", {
        parse_mode: "Markdown",
      });
    }
  },
};