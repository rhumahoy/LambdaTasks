const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const kb = require("./keyboardBtns");
const keyboard = require("./keyboard");
const langSchema = require("./langSchema");

// bot url -> https://t.me/LambdaWeatherBot;
const TOKEN = "6239146694:AAFqobUB48DcTlZBAICR2dRgFHEiPKTWhqk";
const API_KEY = "b830feb871dacd875aff75a307914de8";
const BASE_API = "https://api.openweathermap.org/data/2.5/forecast?";
const DNIPRO = {
  lat: 48.4680221,
  lon: 35.0417711,
};

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case kb.forecast.city:
      bot.sendMessage(chatId, "Выберите интервал", {
        reply_markup: {
          keyboard: keyboard.intervals,
        },
      });
      return;
    case kb.forecast.intervals[3]:
      sendWeatherForecast(chatId, DNIPRO, 3).then(onStart);
      break;
    case kb.forecast.intervals[6]:
      sendWeatherForecast(chatId, DNIPRO, 6).then(onStart);
      break;
    case kb.back:
      onStart(msg);
      break;
  }
});

bot.onText(/\/start/, onStart);

async function getWeatherForecast({
  lat,
  lon,
  interval = 3,
  units = "metric",
  lang = "ru",
}) {
  try {
    const res = await axios.get(
      `${BASE_API}lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${API_KEY}`
    );
    if (res.status !== 200) {
      throw new Error(res.status);
    }

    return parseWeather(res.data.list, {
      units,
      interval,
      lang,
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

function parseWeather(list, { units, interval, lang }) {
  let currentDate = "";
  let curTime = 0;

  return list.reduce((acc, cur) => {
    if (interval !== 3) {
      if (curTime && curTime - cur.dt > 0) {
        return acc;
      }
      curTime = cur.dt + interval * 3600;
    }

    const date = cur.dt_txt.slice(0, 10);
    let newDay = "";
    if (currentDate !== date) {
      currentDate = date;
      newDay = getDayFromStr(cur.dt_txt, langSchema[lang]);
    }

    const time = cur.dt_txt.slice(-8, -3);
    const temp = formatTemp(cur.main.temp, units);
    const feelsLikeTemp = formatTemp(cur.main.feels_like, units);

    return (
      acc +
      "\n" +
      (newDay ? "\n<b>" + newDay + "</b>\n  " : "  ") +
      `${time}, <b>${temp}</b>, ${langSchema[lang].feelsLike} <b>${feelsLikeTemp}</b>, ${cur.weather[0].description}`
    );
  }, "");
}

function getDayFromStr(str, schema) {
  const date = new Date(str);
  const day = date.getDate();
  const dayOfWeek = schema.days[date.getDay()];
  const month = schema.months[date.getMonth()];

  return `${dayOfWeek}, ${day} ${month}:`;
}

function formatTemp(temp, units) {
  let unitType = units === "metric" ? "°C" : "℉";
  return temp > 0 ? `+${temp} ${unitType}` : `${temp} ${unitType}`;
}

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
