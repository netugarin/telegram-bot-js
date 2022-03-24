const TelegramApi = require("node-telegram-bot-api")
const {gameOptions, againOptions} = require("/options")

const botToken = ""

const bot = new TelegramApi(botToken, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадаю число от 0 до 9, а ты должен угадать 🤓" )
    const random_number = Math.floor(Math.random() * 10)
    chats[chatId] = random_number
    await bot.sendMessage(chatId, "Отгадывай 🤗 (пока еще в разработке)", gameOptions)
}

bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"},
    {command: "/info", description: "Узнать своё имя"},
    {command: "/game", description: "Угадай число"}
]).catch(err => console.log(err))

const start = () => {
    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/6.webp")
            return bot.sendMessage(chatId,
                `Мой первый великолепный бот в телеге на JavaScript.
            \nНапиши /info и я скажу, как тебя зовут 🥴`)
        }

        if (text === "/info") {
            const last_name = msg.from.last_name !==  undefined ? msg.from.last_name : ''
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}${last_name} 😊`)
        }

        if (text === "/game") {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз! 🤥")

    })

    bot.on("callback_query", msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === "/again") {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты угадал число!`, againOptions)

        } else {
            return bot.sendMessage(chatId, `Ты не угадал. Бот загадал число ${chats[chatId]}`, againOptions)
        }
    })
}

start()



