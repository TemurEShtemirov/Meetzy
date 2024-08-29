const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null
        this.list = []
    }

    async start(msg) {
        this.mode = "main"
        const txt = this.loadMessage("main");
        await this.sendImage("main");
        await this.sendText(txt);

        // add menu

        this.showMainMenu({
            "start": "Start the bot",
            "gpt": "Let's talk with AI",
            "app": "Demonstrate App",
            "account": "Generate ur Tinder account",
            "message": "Correspondence on your behalf",
            "date": "Correspondence with stars",
            "opener": "Message for acquaintance",
        })

    }

    async html(msg) {
        await this.sendHTML("<h3 style='font-family: 'Roboto', 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif'>Hello World</h3>")
        const html = this.loadHtml("main")
        await this.sendHTML(html, {theme: "dark"})
    }

    async gpt(msg) {
        this.mode = "gpt"
        const txt = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(txt)
    }

    async gptDialog(msg) {
        const txt = msg.text // user text
        const myMsg = await this.sendText("ChatGpt🤖 печатает...")
        const answer = await chatgpt.sendQuestion("Answer to the question", txt)
        await this.editText(myMsg, answer)
    }

    async date(msg) {
        this.mode = "date";
        const txt = this.loadMessage("date")
        await this.sendImage("date")
        await this.sendTextButtons(txt, {
            "date_grande": "Ариана Гранде",
            "date_robbie": "Марго Робби",
            "date_zendaya": "Зендея",
            "date_gosling": "Райан Гослинг",
            "date_hardy": "Том Харди"
        })
    }

    async dateButton(callbackQuery) {
        const query = callbackQuery.data
        await this.sendImage(query)
        console.log(query) // to see candidates for date
        await this.sendText("Отличный выбор 😉 ! Пригласи девушку/парня на свидание за 5 сообщений ;)")
        const prompt = this.loadPrompt(query)
        chatgpt.setPrompt(prompt)
    }

    async dateDialog(msg) {
        const txt = msg.text;
        const myMsg = await this.sendText("печатает...") // loading
        const answer = await chatgpt.addMessage(txt) // req to ai

        await this.editText(myMsg, answer) // editing text after loading using editText method
    }

    async message(msg) {
        this.mode = "message" // message mode

        const txt = this.loadMessage("message")
        await this.sendImage("message")
        await this.sendTextButtons(txt, {
            "message_next": "Следующее сообщение",
            "message_date": "Пригласить на свидание"
        })
    }

    async messageBtn(callbackQuery) {
        const query = callbackQuery.data;
        const prompt = this.loadPrompt(query)
        await console.log(query)
        const userChatHistory = await this.list.join("\n\n")
        const myMsg = await this.sendText("печатает...") // loading
        const answer = await chatgpt.sendQuestion(prompt, userChatHistory)
        await this.editText(myMsg, answer) // editing text after loading using editText method
    }

    async messageDialog(msg) {
        this.list = [] // to empty the list
        const txt = msg.text;
        this.list.push(txt)
    }

    async hello(msg) {

        if (this.mode === "gpt") // ai mode
            await this.gptDialog(msg)
        else if (this.mode === "date") // date mode
            await this.dateDialog(msg)
        else if (this.mode === "message") // message mode
            await this.messageDialog(msg)
        else {

            const txt = msg.text;
            await this.sendText("<b>Hey</b>>"); // bold text
            await this.sendText("<i>How's it going</i>"); // italic text
            await this.sendText(txt);

            await this.sendImage("date")
            await this.sendTextButtons("Which theme u want", { // btn theme
                theme_light: "Light",
                theme_dark: "Dark",
            });
        }

    }

    async helloButton(callbackQuery) {
        const query = await callbackQuery.data;

        if (query === "theme_light") await this.sendText("U have light theme"); // light theme
        else if (query === "theme_dark") await this.sendText("U have dark theme"); // dark theme
    }
}

const chatgpt = new ChatGptService("gpt:60Et7Jza9bA4ePGiBCDOJFkblB3TLxR3EqTzYJuFUFITcRHp") // telegram token
const bot = new MyTelegramBot("7031452318:AAFQPmIQ5qHj5SBsFhYIsJg6g38U_46A3TA"); // ai token
bot.onCommand(/\/start/, bot.start.bind(bot)); // start the bot
bot.onCommand(/\/app/, bot.html.bind(bot)); // demonstrate the app
bot.onCommand(/\/gpt/, bot.gpt.bind(bot)); //gpt
bot.onCommand(/\/date/, bot.date.bind(bot)); //date
bot.onCommand(/\/message/, bot.message.bind(bot)); //date

bot.onTextMessage(bot.hello.bind(bot)); // hello text

bot.onButtonCallback(/^message_.*/, bot.messageBtn) // message call back btn
bot.onButtonCallback(/^date_.*/, bot.dateButton) //call back btn for date
bot.onButtonCallback(/^.*/, bot.helloButton.bind(bot)); // call back btn for choose theme :)
