const kb = require("./keyboardBtns");

module.exports = {
  home: [[kb.forecast.title]],
  intervals: [
    [kb.forecast.intervals[0].text, kb.forecast.intervals[1].text],
    [kb.back]
  ],
  back: [kb.back]
};
