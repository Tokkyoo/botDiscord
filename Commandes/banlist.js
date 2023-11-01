const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {

    name: "banlist",
    description: "Afficher la liste des membres bannis",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,

    async run(bot, interaction, args) {
        await interaction.deferReply();

        const BanListEmbed = new EmbedBuilder()
            .setTitle(`Banlist de ${interaction.guild.name}`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

        const bans = await interaction.guild.bans.fetch();

        if (bans.size < 1) return await interaction.editReply({ content: `Il n'y a aucun bannissement dans ce serveur!`, ephemeral: true });

        let banlist = [];
        for (const ban of bans) {
            banlist.push(ban);
        }
        banlist = banlist.map(ban => ({ user: ban[1].user, reason: ban[1].reason }));
        if (banlist.length <= 10) {
            for (const ban of banlist) {
                BanListEmbed.addFields({ name: `${banlist.findIndex(b => b === ban) + 1}. ${ban.user.globalName ?? ban.user.username}`, value: `Raison: \`${ban.reason}\`` })
            }
            await interaction.editReply({ embeds: [BanListEmbed] });
        } else {
            const banlistPages = [];
            let iteration = 0;
            for (const ban of banlist) {
                if (!banlistPages[iteration]) banlistPages[iteration] = [];
                banlistPages[iteration].push(ban);
                if (banlistPages[iteration].length >= 10) iteration++
            }
            const EmbedPages = [];
            for (let i = 0; i < banlistPages.length; i++) {
                const Embed = new EmbedBuilder()
                    .setTitle(`Banlist de ${interaction.guild.name}`)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `Banlist - Page ${i + 1} / ${banlistPages.length}`, iconURL: interaction.client.user.displayAvatarURL() });

                for (const ban of banlistPages[i]) {
                    Embed.addFields({ name: `${banlist.findIndex(b => b === ban) + 1}. ${ban.user.globalName ?? ban.user.username}`, value: `Raison: ${ban.reason}` });
                }
                EmbedPages.push(Embed);
            }

            const buttonsPremierePage = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('←')
                    .setCustomId('banlist.pagination.left')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setLabel('---')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('never')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setLabel('→')
                    .setCustomId('banlist.pagination.right')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false)
            );

            const buttonDelete = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Supprimer le message')
                    .setEmoji("❌")
                    .setCustomId('banlist.delete')
                    .setStyle(ButtonStyle.Danger)
            );

            const res = await interaction.editReply({ embeds: [EmbedPages[0]], components: [buttonsPremierePage, buttonDelete] });

            const collector = res.createMessageComponentCollector({ time: 1000 * 60 * 60 });

            collector.on('collect', async i => {
                const buttonsMilieu = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('←')
                        .setCustomId('banlist.pagination.left')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setLabel('---')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('never')
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel('→')
                        .setCustomId('banlist.pagination.right')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false)
                );

                const buttonsDernierePage = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('←')
                        .setCustomId('banlist.pagination.left')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setLabel('---')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('never')
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel('→')
                        .setCustomId('banlist.pagination.right')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );

                if (i.customId === 'banlist.pagination.left') {
                    let pageText = i.message.embeds[0].data.footer.text.split('/')[0].trim();
                    pageText = pageText.slice(pageText.length - 1, pageText.length);
                    const pageNumber = pageText - 1;
                    if (pageNumber - 2 < 0) {
                        await i.deferUpdate();
                        await i.message.edit({ embeds: [EmbedPages[pageNumber - 1]], components: [buttonsPremierePage, buttonDelete] });
                    } else {
                        await i.deferUpdate();
                        await i.message.edit({ embeds: [EmbedPages[pageNumber - 1]], components: [buttonsMilieu, buttonDelete] });
                    }
                }
                if (i.customId === 'banlist.pagination.right') {
                    let pageText = i.message.embeds[0].data.footer.text.split('/')[0].trim();
                    pageText = pageText.slice(pageText.length - 1, pageText.length);
                    const pageNumber = pageText - 1;
                    if (pageNumber + 2 === EmbedPages.length) {
                        await i.deferUpdate();
                        await i.message.edit({ embeds: [EmbedPages[pageNumber + 1]], components: [buttonsDernierePage, buttonDelete] });
                    } else {
                        await i.deferUpdate();
                        await i.message.edit({ embeds: [EmbedPages[pageNumber + 1]], components: [buttonsMilieu, buttonDelete] });
                    }
                }
                if (i.customId === 'banlist.delete') {
                    await i.deferUpdate();
                    await i.message.delete();
                }
            });

            collector.on('end', async () => {
                if (await interaction.channel.messages.fetch(res.id)) await res.delete();
            })
        }
    }
}

