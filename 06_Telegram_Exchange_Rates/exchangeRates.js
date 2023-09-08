const axios = require("axios");
module.exports = { getExchangeRates };
const PRIVAT_API =
  "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";
const MONO_API = "https://api.monobank.ua/bank/currency";

const curCodes = {
  UAH: 980,
  USD: 840,
  EUR: 978,
};

const timeout = 300;
let ts = 0;

const exchangeRates = {
  USD: {
    privat: {
      buy: 0,
      sell: 0,
    },
    mono: {
      buy: 0,
      sell: 0,
    },
  },
  EUR: {
    privat: {
      buy: 0,
      sell: 0,
    },
    mono: {
      buy: 0,
      sell: 0,
    },
  },
};

async function getCurrencyRate(currency) {
  try {
    const privatRes = await axios.get(PRIVAT_API);
    const monoRes = await axios.get(MONO_API);

    if (
      privatRes.status !== 200 ||
      (monoRes.status !== 200 && monoRes.status !== 429)
    ) {
      throw new Error(
        `Privat status: ${privatRes.status}\nMono status: ${monoRes.status}`
      );
    }

    const now = Date.now();
    if (ts + timeout * 1000 < now) {
      ts = now;

      Object.keys(exchangeRates).forEach((cur) => {
        const privatCur = privatRes.data.find(({ ccy }) => ccy === cur);
        if (privatCur) {
          exchangeRates[cur].privat.buy = privatCur.buy;
          exchangeRates[cur].privat.sell = privatCur.sale;
        }

        if (monoRes.status === 200) {
          const monoCur = monoRes.data.find(
            ({ currencyCodeA, currencyCodeB }) =>
              currencyCodeA === curCodes[cur] && currencyCodeB === curCodes.UAH
          );
          if (monoCur) {
            exchangeRates[cur].mono.buy = monoCur.rateBuy;
            exchangeRates[cur].mono.sell = monoCur.rateSell;
          }
        }
      });
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    return exchangeRates[currency];
  }
}

async function getExchangeRates(currency) {
  const rate = await getCurrencyRate(currency);

  return `
 <b>ПриватБанк</b>
  <b>Покупка</b>   ${rate.privat.buy}
  <b>Продажа</b>  ${rate.privat.sell}\n
<b>monobank</b>
  <b>Покупка</b>   ${rate.mono.buy}
  <b>Продажа</b>  ${rate.mono.sell}
  `;
}
