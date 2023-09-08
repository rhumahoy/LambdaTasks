const axios = require("axios");
const langSchema = require("./langSchema");

const API_KEY = "b830feb871dacd875aff75a307914de8";
const BASE_API = "https://api.openweathermap.org/data/2.5/forecast?";

module.exports = {
  getWeatherForecast
};

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