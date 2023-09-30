const axios = require("axios");
const https = require("node:https");
const { readFileSync } = require("node:fs");

const endpoints = JSON.parse(readFileSync("./endpoints.json", "utf8"));


// skip ssl certificate
// (without skiping certificate check all endpoints return an error)
const axiosSkipCert = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// adding retry option
axiosSkipCert.interceptors.response.use(undefined, (err) => {
  const { config, message } = err;

  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  if (!(message.includes("timeout") || message.includes("Network Error"))) {
    return Promise.reject(err);
  }

  config.retry -= 1;
  const delayRetryRequest = new Promise((res) => {
    setTimeout(() => {
      res();
    }, config.retryDelay || 500);
  });

  return delayRetryRequest.then(() => axiosSkipCert(config));
});

getData(endpoints);


async function getData(endpoints) {
  const data = await Promise.all(endpoints.map(getJSON));
  const isDone = {
    true: 0,
    false: 0,
  };

  data.forEach((obj, i) => {
    if (obj === undefined) {
      return;
    }

    const res = searchInObj(obj, "isDone");
    if (res === undefined) {
      return;
    }

    isDone[res]++;
    console.log(`${endpoints[i]}\t isDone - ${res}`);
  });

  console.log(`
    Значений True: ${isDone.true},
    Значений False: ${isDone.false}
  `);
}

async function getJSON(endpoint) {
  try {
    const res = await axiosSkipCert.get(endpoint, { retry: 3 });
    return res.data;
  } catch (err) {
    console.error(endpoint, err.message);
    console.log('\n');
  }
}

function searchInObj(obj, target) {
  if (obj.hasOwnProperty(target)) {
    return obj[target];
  }

  const queue = [];
  addObjToQueue(obj, queue);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.hasOwnProperty(target)) {
      return current[target];
    }
    addObjToQueue(current, queue);
  }
}

function addObjToQueue(obj, queue) {
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      queue.push(obj[key]);
    }
  }
}
