const kb = require("./keyboardBtns");

module.exports = {
  home: [[kb.forecast.title], [kb.exchange.title]],
  intervals: [
    [kb.forecast.intervals[0].text, kb.forecast.intervals[1].text],
    [kb.back],
  ],
  exchange: [
    [kb.exchange.currencies[0].text, kb.exchange.currencies[1].text],
    [kb.back],
  ],
  back: [kb.back],
};
