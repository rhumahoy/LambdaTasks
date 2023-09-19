const { readFileSync, readdirSync } = require("node:fs");

const dirPath = "./2kk_words_400x400";

const arr = getFiles(dirPath);
const arrOfSets = arr.map((val) => new Set(val.split("\n")));
const unique = new Set(arrOfSets.flatMap((set) => Array.from(set)));

getUniqueValues(unique); //Unique values: 129240
existInAllFiles(unique, arrOfSets); //Exist in all files: 441
existInAtleastTen(unique, arrOfSets); //Exist in at least ten files: 73245

//  Average Time (ns)
//  2626400970.0000286

function getFiles(dir) {
  const arr = [];
  const filesList = readdirSync(dir);

  for (const fileName of filesList) {
    const filePath = `${dir}/${fileName}`;
    const data = readFileSync(filePath, "utf8");
    arr.push(data);
  }

  return arr;
}

function getUniqueValues(set) {
  console.log("Unique values:", set.size);
}

function existInAllFiles(uniqueVals, arrOfSets) {
  let counter = 0;
  uniqueVals.forEach((val) => {
    if (arrOfSets.every((set) => set.has(val))) {
      counter++;
    }
  });

  console.log("Exist in all files:", counter);
}

function existInAtleastTen(uniqueVals, arrOfSets) {
  const exist = existInFiles(uniqueVals, arrOfSets, 10);
  console.log("Exist in at least ten files:", exist);
}

function existInFiles(uniqueVals, arrOfSets, amount) {
  let counter = 0;

  uniqueVals.forEach((val) => {
    const exist = arrOfSets.filter((set) => set.has(val));
    if (exist.length >= amount) {
      counter++;
    }
  });

  return counter;
}
