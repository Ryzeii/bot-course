const TelegramApi = require("node-telegram-bot-api");

const token = "7736548015:AAHmgqQaVdkDRtSbu6_mzheXLqg2wUjxMCE";

const bot = new TelegramApi(token, { polling: true });
const { gameOptions, againOptions } = require("./option.js");

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

bot.setMyCommands([
  { command: "/start", description: "Начальное привествие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/game", description: "Игра угадай число" },
]);

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chat = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chat,
        "https://cdn2.combot.org/hocker/webp/1xf09f988f.webp"
      );
      return bot.sendMessage(
        chat,
        `Добро пожаловать в телеграм бот автора kulikDebil`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chat,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chat);
    }
    return bot.sendMessage(chat, "Я тебя не понимаю, попробуй еще раз!)");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
