const TelegramBot = require("node-telegram-bot-api");
const kb = require("./keyboardBtns");
const keyboard = require("./keyboard");
const { getWeatherForecast } = require("./weatherForecast");

// bot url -> https://t.me/LambdaWeatherBot;
const TOKEN = "6239146694:AAFqobUB48DcTlZBAICR2dRgFHEiPKTWhqk";

const DNIPRO = {
  lat: 48.4680221,
  lon: 35.0417711,
};

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case kb.forecast.title:
      bot.sendMessage(chatId, "Выберите интервал", {
        reply_markup: {
          keyboard: keyboard.intervals,
        },
      });
      return;
    case kb.forecast.intervals[0].text:
      sendWeatherForecast(chatId, DNIPRO, kb.forecast.intervals[0].query);
      break;
    case kb.forecast.intervals[1].text:
      sendWeatherForecast(chatId, DNIPRO, kb.forecast.intervals[1].query);
      break;
    case kb.back:
      onStart(msg);
      break;
  }
});

bot.onText(/\/start/, onStart);

async function sendWeatherForecast(chatId, { lat, lon }, interval) {
  const forecast = await getWeatherForecast({ lat, lon, interval });

  try {
    return bot.sendMessage(chatId, forecast, {
      parse_mode: "HTML",
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

function onStart(msg) {
  bot.sendMessage(msg.chat.id, "Выберите прогноз", {
    reply_markup: {
      keyboard: keyboard.home,
    },
  });
}
