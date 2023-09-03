import { input, select, confirm } from "@inquirer/prompts";
import { readFile, writeFile } from "fs/promises";

const DB = "./users.txt";

const createUsers = async () => {
  const name = (
    await input({ message: "Enter the name (to cancel press ENTER)" })
  ).trim();

  if (!name) {
    return Promise.resolve();
  }

  const gender = await select({
    message: "Choose your Gender",
    choices: [
      { name: "male", value: "male" },
      { name: "female", value: "female" },
    ],
  });

  const age = parseInt(
    (
      await input({
        message: "Enter your age",
        validate: (value) => {
          const trimmed = value.trim();
          if (isNaN(trimmed) || parseInt(trimmed) !== +trimmed || trimmed < 1) {
            return "Only positive integer is allowed";
          }

          return true;
        },
      })
    ).trim()
  );

  addUser({ name, gender, age });
  return createUsers();
};

const addUser = async (user) => {
  writeFile(DB, JSON.stringify(user) + "\n", { flag: "a" });
};

const findUser = async () => {
  const name = (await input({ message: "Enter a name to search" })).trim();
  const users = await getUsers();

  const target = new RegExp(`(${name.toLowerCase()})`, "i");
  const matches = users.filter((user) => user.name.toLowerCase().match(target));

  if (!matches.length) {
    console.log(`User ${name} was not found.`);
    return;
  }

  console.log(`User ${name} was found`);
  console.log(matches);
};

const getUsers = async () => {
  const data = (await readFile(DB, "utf8")).trimEnd();
  const users = data.split("\n").map((user) => JSON.parse(user));
  return users;
};

createUsers().then(async () => {
  const find = await confirm({
    message: "Would you like to search for a user in DB?",
  });

  if (find) findUser();
});
