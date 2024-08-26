const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    async start(msg) {
        this.mode = "main"
        const text = this.loadMessage("main");
        await this.sendImage("main");
        await this.sendText(text);
    }

    async html(msg) {
        await this.sendHTML("<h3 style='font-family: 'Roboto', 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif'>Hello World</h3>")
        const html = this.loadHtml("main")
        await this.sendHTML(html, {theme: "dark"})
    }

    async gpt(msg) {
        this.mode = "gpt"
        await this.sendText("Les talk with AI")
    }

    async gptDialog(msg) {
        const text = msg.text
        const answer = await chatgpt.sendQuestion("Answer to the question", text)
        await this.sendText(answer)
    }

    async hello(msg) {

        if (this.mode === "gpt")
            await this.gptDialog(msg)
        else {

            const text = msg.text;
            await this.sendText("<b>Hey<b/>");
            await this.sendText("<i>How's it going</i>");
            await this.sendText(text);

            await this.sendImage("date")
            await this.sendTextButtons("Which theme u want", {
                theme_light: "Light",
                theme_dark: "Dark",
            });
        }

    }

    async helloButton(callbackQuery) {
        const query = await callbackQuery.data;
        if (query === "theme_light") await this.sendText("U have light theme");
        else if (query === "theme_dark") await this.sendText("U have dark theme");
    }
}

const chatgpt = new ChatGptService("gpt:60Et7Jza9bA4ePGiBCDOJFkblB3TLxR3EqTzYJuFUFITcRHp")
const bot = new MyTelegramBot("7031452318:AAFQPmIQ5qHj5SBsFhYIsJg6g38U_46A3TA");
bot.onCommand(/\/start/, bot.start.bind(bot)); // start the bot
bot.onCommand(/\/html/, bot.html.bind(bot)); //html
bot.onCommand(/\/gpt/, bot.gpt.bind(bot)); //gpt
bot.onTextMessage(bot.hello.bind(bot));
bot.onButtonCallback(/^.*/, bot.helloButton.bind(bot));
