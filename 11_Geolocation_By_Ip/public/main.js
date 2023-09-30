const form = document.querySelector("form");
const rows = document.querySelectorAll(".details__content_row");
const loadingEl = document.querySelector(".details--loading");
const errorEl = document.querySelector(".details--error");
const errorMsgEl = document.getElementById("error");
const lookupBtn = document.getElementById("lookupBtn");

const contentEl = document.querySelector(".details__content");

const ipEl = document.getElementById("ip");
const countryEl = document.getElementById("location");
const rangeFromEl = document.getElementById("range_from");
const rangeToEl = document.getElementById("range_to");

const BASE_URL = "/api/ip";

document.addEventListener("DOMContentLoaded", () => {
  setData();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  setData(e.target.ip.value);
});

const setData = async (ip = "") => {
  lookupBtn.setAttribute("disabled", true);

  let timeout = setTimeout(() => {
    setLoading(true);
  }, 500);
  try {
    const res = await fetchIpData(ip);
    const data = await res.json();

    if (res.status !== 200 && data.success === false) {
      throw new Error(data.message);
    }

    ipEl.textContent = data.ip;
    countryEl.textContent = `${data.country} (${data.country_code})`;
    rangeFromEl.textContent = data.ip_range.from;
    rangeToEl.textContent = data.ip_range.to;
    showContent(true);
  } catch (error) {
    showContent(false);
    errorMsgEl.textContent = error.message;
    errorEl.setAttribute("hidden", false);
  } finally {
    clearTimeout(timeout);
    setLoading(false);
  }
};

const fetchIpData = async (ip = "") => {
  const trimmedIp = ip.trim();
  let res;

  try {
    if (!trimmedIp) {
      res = await fetch(BASE_URL);
    } else {
      res = await fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify({ ip: trimmedIp }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return res;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const setLoading = (state = true) => {
  if (state) {
    lookupBtn.setAttribute("disabled", true);
    errorEl.setAttribute("hidden", true);
    showContent(false);
    loadingEl.setAttribute("hidden", false);
  } else {
    lookupBtn.removeAttribute("disabled");
    loadingEl.setAttribute("hidden", true);
  }
};

const showContent = (state) => {
  if (state) {
    contentEl.removeAttribute("hidden");
  } else {
    contentEl.setAttribute("hidden", true);
  }
};