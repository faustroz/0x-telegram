const axios = require("axios");

module.exports = {
  pattern: /\/news/,
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      const articles = response.data.articles.slice(0, 5); // Ambil 5 berita teratas

      if (articles.length === 0) {
        return bot.sendMessage(chatId, "⚠️ Tidak ada berita terbaru saat ini.");
      }

      let newsMessage = "📰 *Berita Terbaru di Indonesia:*\n\n";
      articles.forEach((article, index) => {
        newsMessage += `🔹 *${article.title}*\n`;
        newsMessage += `📌 [Baca Selengkapnya](${article.url})\n\n`;
      });

      bot.sendMessage(chatId, newsMessage, { parse_mode: "Markdown", disable_web_page_preview: true });
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "⚠️ Gagal mengambil berita. Coba lagi nanti.");
    }
  },
};
