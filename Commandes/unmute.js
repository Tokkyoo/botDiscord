const Discord = require('discord.js');
const ms = require ("ms")

module.exports = {
    name: "unmute",
    description: "Unmute un membre",
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
        description: "La raison du mute",
        required: false,
    }
    ],


    async run(bot, message, args) {
        
        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre")
        let member = message.guild.members.cache.get(user.id)
        let reason = args.getString("raison")
        if(!reason) reason = "Pas de raison!";

        if(!member.moderatable) return message.reply("Je ne peux pas unmute ce membre !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Vous ne pouvez pas unmute ce membre!")

        if(member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute !")

        try{await user.send(`Tu as été unmute du serveur ${message.guild.name}`) } catch   (err) {}

        await message.reply(`${message.user} a unmute ${user.tag} pour la raison : \`${reason}\``)

        await member.timeout(null, reason)
    }
}