'use strict';
const START_MSG = "Enter words or numbers divided by space: ";
process.stdin.setEncoding("utf-8");

let data = [];

console.clear();
onStart();

process.stdin.on("data", (chunk) => {
  const trimmed = chunk.trim();

  if (trimmed === "exit") {
    process.exit(0);
  }

  if (!data.length) {
    data = trimmed.split(" ");
  }

  if ((
      data.length && isNaN(trimmed)
    ) || (
      1 > trimmed || trimmed > commands.length
    )) {
    process.stdout.write(commandsListMsg);
  } else {
    console.log(commands[trimmed - 1].handler(data));
    onStart();
  }
});

const selectWords = (data) => data.filter((val) => isNaN(val));
const selectNums = (data) => data.filter((val) => !isNaN(val));

const commands = [
  {
    title: "Sort words alphabetically",
    handler: (data) => selectWords(data).sort((a, b) => a.localeCompare(b)),
  },
  {
    title: "Display numbers from smallest to largest",
    handler: (data) => selectNums(data).sort((a, b) => a - b),
  },
  {
    title: "Display numbers from largest to smallest",
    handler: (data) => selectNums(data).sort((a, b) => b - a),
  },
  {
    title:
      "Display words in ascending order of the number of letters in a word.",
    handler: (data) => selectWords(data).sort((a, b) => a.length - b.length),
  },
  {
    title: "Show only unique words",
    handler: (data) => Array.from(new Set(selectWords(data)).values()),
  },
  {
    title: "Show only unique values from the entire set of words and numbers",
    handler: (data) => Array.from(new Set(data).values()),
  },
];

const commandsList = commands.reduce(
  (acc, cur, i) => (acc += `${i + 1}. ${cur.title}\n`),
  "\n"
);

const commandsListMsg = commandsList + `\nSelect (1 - ${commands.length}) and press Enter: `;

function onStart() {
  data = [];

  process.stdout.write('\n' + START_MSG);
}