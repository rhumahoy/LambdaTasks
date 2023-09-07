const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
process.env["NTBA_FIX_350"] = 1;

// bot url -> https://t.me/console_notes_bot
const TOKEN = "6629305958:AAF-eOZa--Bj6rd4dbc4mU-BuXq8ijBUzXA";

const bot = new TelegramBot(TOKEN, { polling: true, filepath: false });

bot.on("message", (msg) => {
  const user = `Пользователь ${
    msg.from.first_name + (msg.from.last_name || "")
  }`;

  const chatId = msg.chat.id;
  if (msg.text === "photo") {
    console.log(`${user} запросил картинку`);

    axios
      .get("https://picsum.photos/200/300", { responseType: "arraybuffer" })
      .then((res) => {
        bot.sendPhoto(chatId, res.data);
      });
    return;
  }

  console.log(`${user} написал: ${msg.text}`);
  bot.sendMessage(chatId, `Вы написали: "${msg.text}"`);
});
