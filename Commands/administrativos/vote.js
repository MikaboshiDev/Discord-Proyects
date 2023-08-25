const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, } = require("discord.js");
const { PermissionFlagsBits, Colors } = require('discord.js');
const chalk = require("chalk");
module.exports = {
    botpermisos: ["ManageRoles", "ManageChannels", "ManageMessages"],
    data: new SlashCommandBuilder()
        .setName('votos')
        .setDescription('⛳ Creates a vote to kick member from your voice channel.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Seleccione el miembro que desea expulsar.')
                .setRequired(true)
        ),

    async execute(interaction) {

        const { member, options } = interaction;
        const target = options.getMember('member');
        console.log(chalk.redBright(`[Comando]`) + chalk.whiteBright(` Se ha usado el comando vote en ${interaction.guild.name} con id ${interaction.guild.id} por ${interaction.user.tag} con id ${interaction.user.id}`));
        if (!target.voice.channel) {
            return interaction.reply({ content: `**El miembro no fue encontrado en el canal de voz.**`, ephemeral: true });
        };

        if (target.voice.channel !== member.voice.channel) {
            return interaction.reply({ content: '**¡Debes estar en el mismo canal de voz!**', ephemeral: true })
        };

        if (target.permissions.has(PermissionFlagsBits.Administrator) || target.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: `**No puedes patear a este miembro**`, ephemeral: true })
        };

        if (member.voice.channel.members.size == 2) {
            return interaction.reply({ content: `**No puedes votar en un canal con solo 2 miembros.**`, ephemeral: true })
        };

        const users = member.voice.channel.members.size;
        const channel = member.voice.channel;
        const votesNeed = Math.round((users - 1) * 0.5 + 1);

        let memberMention = "";

        channel.members.each((user) => {
            if (user.id == target.id) {
                return;
            } else {
                memberMention += `<@${user.id}> `
            }
        });

        const message = await interaction.reply({
            content: memberMention,
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setThumbnail(target.displayAvatarURL())
                    .setAuthor({
                        name: member.user.username,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(
                        `**comienza a votar para patear <@${target.id}> out**\n\n`
                        + `**Tiempo para votar:** _1 minutos..._\n`
                        + `**Necesita votos**: _${votesNeed}_`
                    )
            ],
            fetchReply: true
        });

        const filterReactions = (reaction) => ['👍'].includes(reaction.emoji.name);

        message.react('👍');

        message.awaitReactions({ filterReactions, maxUsers: users , time: 1000 * 60 * 1 })
            .then(collected => {
                if (collected.get('👍').count > votesNeed) {
                    message.reactions.removeAll();

                    try {
                        target.voice.disconnect()
                    } catch { };

                    message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Se termino la votacion - <@${target.id}> es expulsado.**\n\n`
                                    + `**Ha sido baneado del canal** ${channel.name}\n\n`
                                    + `**Votos recogidos**: ${(collected.get('👍').count) - 1}`
                                )
                                .setTimestamp()
                        ]
                    }).then(channel.permissionOverwrites.edit(target, { Connect: false }))
                };

                if (collected.get('👍').count <= votesNeed) {
                    message.reactions.removeAll()
                    return message.edit({
                        content: ' ',
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setThumbnail(target.displayAvatarURL())
                                .setDescription(
                                    `**Se termino la votacion - <@${target.id}> no es expulsado**.\n\n`
                                    + `**Necesito votos**: ${votesNeed}\n`
                                    + `**Votos recogidos**: ${(collected.get('👍').count - 1)}`
                                )
                                .setTimestamp()
                        ]
                    });
                }
            })
    }
}
