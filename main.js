const Discord = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({ intents })
const loadCommands = require("./Loaders/loadCommands.js")
const loadEvents = require("./Loaders/loadEvents.js")
const config = require('./config.js'); // Supprimez le chemin relatif


bot.commands= new Discord.Collection()

bot.login(config.token)
loadCommands(bot)
loadEvents(bot)

bot.on("messageCreate", async (message) => {
    if(message.content === "!ping") return bot.commands.get("ping").run(bot, message)
})

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`)
})

