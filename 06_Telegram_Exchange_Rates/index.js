const TelegramBot = require("node-telegram-bot-api");
const kb = require("./keyboardBtns");
const keyboard = require("./keyboard");
const { getWeatherForecast } = require("./weatherForecast");
const { getExchangeRates } = require("./exchangeRates");

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
    case kb.exchange.title:
      bot.sendMessage(chatId, "Выберите валюту", {
        reply_markup: {
          keyboard: keyboard.exchange,
        },
      });
      break;
    case kb.forecast.intervals[0].text:
      sendWeatherForecast(chatId, DNIPRO, kb.forecast.intervals[0].query);
      break;
    case kb.forecast.intervals[1].text:
      sendWeatherForecast(chatId, DNIPRO, kb.forecast.intervals[1].query);
      break;
    case kb.exchange.currencies[0].text:
      sendExchangeRates(chatId, kb.exchange.currencies[0].query);
      break;
    case kb.exchange.currencies[1].text:
      sendExchangeRates(chatId, kb.exchange.currencies[1].query);
      break;
    case kb.back:
      onStart(msg);
      break;
  }
});

bot.onText(/\/start/, onStart);

async function sendWeatherForecast(chatId, { lat, lon }, interval) {
  try {
    const forecast = await getWeatherForecast({ lat, lon, interval });

    return bot.sendMessage(chatId, forecast, {
      parse_mode: "HTML",
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

async function sendExchangeRates(chatId, currency) {
  try {
    const exchangeRates = await getExchangeRates(currency);

    return bot.sendMessage(chatId, exchangeRates, {
      parse_mode: "HTML",
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

function onStart(msg) {
  bot.sendMessage(msg.chat.id, "Выберите действие", {
    reply_markup: {
      keyboard: keyboard.home,
    },
  });
}
