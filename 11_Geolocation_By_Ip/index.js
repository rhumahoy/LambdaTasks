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

});

app.listen(5000, () => {
  console.log("Server is litening on port 5000...");
});