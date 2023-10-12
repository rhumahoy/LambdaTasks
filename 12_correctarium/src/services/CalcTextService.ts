export type TLangNames = "ua" | "ru" | "eng";

type TLangCosts = {
  oneSign: number;
  min: number;
  edit: {
    signH: number;
  };
};

export type TLangServices = keyof Omit<TLangCosts, "min" | "oneSign">;

type TWorkHours = {
  start: number;
  end: number;
};

const primaryMimeTypes = ["doc", "docx", "rtf"];

const workHours: TWorkHours = {
  start: 10,
  end: 19,
};

const langsCosts: Record<TLangNames, TLangCosts> = {
  ua: {
    min: 50,
    oneSign: 0.05,
    edit: {
      signH: 1333,
    },
  },
  ru: {
    min: 50,
    oneSign: 0.05,
    edit: {
      signH: 1333,
    },
  },
  eng: {
    min: 120,
    oneSign: 0.12,
    edit: {
      signH: 333,
    },
  },
};

const calcCost = (lang: TLangNames, text: string, mimeType?: string) => {
  const total = Math.round(langsCosts[lang].oneSign * text.length * 100) / 100;
  return Math.max(langsCosts[lang].min, calcMimeOffset(total, mimeType));
};

const calcDeadline = (
  lang: TLangNames,
  textLength: number,
  service: keyof Omit<TLangCosts, "min" | "oneSign">,
  mimeType?: string,
  minMins = 30
) => {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Kiev",
    })
  );

  const hoursLeft =
    Math.round((textLength / langsCosts[lang][service].signH) * 100) / 100;

  let minsLeft = Math.round(hoursLeft * 60) + minMins;
  minsLeft = Math.max(calcMimeOffset(minsLeft, mimeType), 60);

  while (minsLeft > 0) {
    let hours = now.getHours();

    if (hours < workHours.start) {
      now.setMinutes(0);
      now.setHours(workHours.start);
      continue;
    }

    let dayOffset = 0;
    let mins = hours * 60 + now.getMinutes();
    const dayOfTheWeek = now.getDay();

    if (mins + minsLeft > workHours.end * 60) {
      minsLeft += Math.min(mins - workHours.end * 60, 0);

      dayOffset++;
      now.setMinutes(0);
      now.setHours(workHours.start);
    } else {
      now.setMinutes(now.getMinutes() + minsLeft);
      minsLeft = 0;
    }

    if (dayOfTheWeek === 6) {
      dayOffset = 2;
    }

    if (dayOfTheWeek === 0) {
      dayOffset = 1;
    }

    now.setDate(now.getDate() + dayOffset);
  }

  return {
    time: hoursLeft,
    deadline: Math.round(now.getTime() / 1000),
    deadline_date: now.toLocaleString("uk-UA", {
      dateStyle: "short",
      timeStyle: "short",
    }),
  };
};

function calcMimeOffset(val: number, mimeType?: string) {
  let offset = 0;
  if (mimeType && mimeType !== "none" && !primaryMimeTypes.includes(mimeType)) {
    offset = Math.round(val * 0.2);
  }

  return val + offset;
}

export { calcCost, calcDeadline };
