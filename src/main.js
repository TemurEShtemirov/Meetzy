const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    // Мы будем писать тут наш код
hello(){

}
}



const bot = new MyTelegramBot("7031452318:AAFQPmIQ5qHj5SBsFhYIsJg6g38U_46A3TA");
// Мы будем писать тут наш код