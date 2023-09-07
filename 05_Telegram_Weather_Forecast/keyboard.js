const kb = require("./keyboardBtns");

module.exports = {
  home: [[kb.forecast.city]],
  intervals: [
    [kb.forecast.intervals[3], kb.forecast.intervals[6]],
    [kb.back]
  ],
  back: [kb.back]
};
