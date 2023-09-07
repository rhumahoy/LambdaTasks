const { Command } = require("commander");
const TelegramBot = require("node-telegram-bot-api");
process.env["NTBA_FIX_350"] = 1;
const TOKEN = "6629305958:AAF-eOZa--Bj6rd4dbc4mU-BuXq8ijBUzXA";

const botUrl = "https://t.me/console_notes_bot";
const chatId = 302951553;

const program = new Command();
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

program
  .name("Telegram console sender")
  .description(`Console Sender to ${botUrl}`);

program
  .command("message <message>")
  .alias("m")
  .description("Send message to Telegram Bot")
  .action((message) => {
    bot.sendMessage(302951553, message).then(() => {
      process.exit(0);
    });
  });

program
  .command("photo <path>")
  .alias("p")
  .description(
    "Send photo to Telegram Bot. Just drag and drop image to console or enter entire path to image"
  )
  .action((path) => {
    bot.sendPhoto(chatId, path, {}).then(() => {
      process.exit(0);
    });
  });

program.parse();
