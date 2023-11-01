const Discord = require("discord.js")

module.exports = {

    name: "kick",
    description: "Bannir un membre",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à kick",
            required: true
        }, {
            type: "string",
            name: "raison",
            description: "La raison du kick",
            required: false
        }
    ],

    async run(bot, message, args) {


            let user = args.getUser("membre")
            
            let member = message.guild.members.cache.get(user.id)
            if (!member) return message.reply("Pas de membre à kick!")

            let reason = args.getString("raison")
            if (!reason) reason = "Aucune raison fournie.";

            if (message.user.id === user.id) return message.reply("Essaie pas de kick ce membre !")
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Vous ne pouvez pas kick le propriétaire du serveur !")
            if (!member?.bannable) return message.reply("Je ne peux pas bannir ce membre !")
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Vous ne pouvez pas kick ce membre !")
            

            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) { }

            await message.reply(`${message.user} a kick ${user.tag} pour la raison : \`${reason}\``)

            await member.kick(reason)

    }
    
}