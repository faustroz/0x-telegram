const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');
const token = '7626028585:AAHcl9pJNLPdrhJ4hDm-eBDYrx3vB-F_bp0';
const Tesseract = require('tesseract.js');  // Library untuk OCR
const fs = require('fs');
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
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

// Handle /qr command
bot.onText(/\/qr (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const textToConvert = match[1];

  try {
    const filePath = 'qrcode.png';
    await QRCode.toFile(filePath, textToConvert);
    bot.sendPhoto(chatId, filePath, { caption: `✅ QR Code for: ${textToConvert}\n\n🤖 Bot by Made Ferdy Diatmika` });

    // Clean up the temporary file after sending it
    fs.unlinkSync(filePath);
  } catch (err) {
    bot.sendMessage(chatId, '❌ Failed to generate QR Code.');
    console.error(err);
  }
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest resolution image

    bot.getFile(fileId).then(file => {
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

        // Download image to local file
        const localPath = `./${file.file_path.split('/').pop()}`;
        bot.downloadFile(fileId, './').then(() => {
            // Use Tesseract.js to do OCR on the image
            Tesseract.recognize(
                localPath,
                'eng',  // Language for OCR, can be changed to 'ind' for Indonesian
                {
                    logger: (m) => console.log(m)  // Log the process
                }
            ).then(({ data: { text } }) => {
                bot.sendMessage(chatId, `🎤 Teks dari gambar:\n*${text}*`, { parse_mode: 'Markdown' });

                // Clean up the downloaded image after processing
                fs.unlinkSync(localPath);
            }).catch(err => {
                bot.sendMessage(chatId, '❌ Gagal mengenali teks dari gambar.');
                console.error(err);
            });
        }).catch(err => {
            bot.sendMessage(chatId, '❌ Gagal mengunduh gambar.');
            console.error(err);
        });
    }).catch(err => {
        bot.sendMessage(chatId, '❌ Gagal mengambil gambar.');
        console.error(err);
    });
});

console.log('Bot has been started...');
