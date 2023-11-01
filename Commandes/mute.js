const Discord = require('discord.js');

module.exports = {
    name: "ping",
    description: "Mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers, 
    dm: false,
    options:[
    {
        type: "user",
        name: "membre",
        description: "Le membre à mute",
        required: true,
        
    },
    {
        type: "string",
        name: "raison",
        description: "Le temps du mute",
        required: true,
    },
    {
        type: "string",
        name: "raison",
        description: "La raison du mute",
        required: false,
    }
    ],


    async run(bot, message, args) {
        await message.reply(`Ping : ${bot.ws.ping}`)
    }
}