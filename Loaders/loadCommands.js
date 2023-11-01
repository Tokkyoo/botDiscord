const fs = require("fs");

module.exports = async bot => {
    fs.readdirSync("./Commandes").filter(file => file.endsWith(".js")).forEach(async file => {
        let command = require(`../Commandes/${file}`);
        bot.commands.set(command.name, command);
        console.log(`Commande ${command.name} chargée avec succès!`);
    });
};
