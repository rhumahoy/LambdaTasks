const { readFileSync } = require("node:fs");
const express = require("express");
const app = express();

const DBPATH = "./IP2LOCATION-LITE-DB1.CSV";
const DB = readFileSync(DBPATH, "utf8").trimEnd().split("\r\n");

app.get("/api/ip", (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

    sendDataByIp(ip, res);
});

app.listen(5000, () => {
  console.log("Server is litening on port 5000...");
});

function sendDataByIp(ip, res) {
  try {
    const intIp = ip2Int(ip);
    if (!intIp) {
      throw new Error("Invalid input address");
    }

    const data = findByIntIp(DB, intIp);
    if (!data) {
      throw new Error(`Cannot find data for ip: ${ip}`);
    }

    return res.status(200).json({ ip, ...data });
  } catch (error) {
    console.error(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
}