const QRCode = require("qrcode");
const fs = require("fs");

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

      fs.unlinkSync(filePath);
    } catch (err) {
      bot.sendMessage(chatId, "❌ Failed to generate QR Code.");
      console.error(err);
    }
  },
};
