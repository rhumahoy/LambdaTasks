const { readFileSync } = require("node:fs");
const JSONPATH = "./users.json";

const users = readFileSync(JSONPATH, "utf8");
const json = JSON.parse(users);

const beautify = (json) => {
  const map = new Map();

  json.forEach(({ user, startDate, endDate }) => {
    if (!map.has(user.name)) {
      map.set(user.name, {
        userId: user._id,
        name: user.name,
        weekendsDates: [{ startDate, endDate }],
      });
      return;
    }

    map.get(user.name).weekendsDates.push({ startDate, endDate });
  });

  json.length = 0;
  json.push(...map.values());
  return json;
};

beautify(json);
console.log(json);
