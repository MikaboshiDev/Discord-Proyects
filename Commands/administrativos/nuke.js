const {
    EmbedBuilder,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ButtonStyle,
    PermissionFlagsBits,
    ChannelType
  } = require("discord.js");
const Discord = require(`discord.js`);
const chalk = require("chalk");
module.exports = {
    permisos: ["ManageChannels", "ManageMessages"],
    botpermisos: ["ManageChannels", "ManageMessages", "ManageGuild"],
    data: new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("⛳ Elimina todos los mensajes de un canal")
        .addChannelOption((option) => {
            return option
            .setName("channel")
            .setRequired(false)
            .setDescription("Channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)}),
        /**
        * @param {ChatInputCommandInteraction} interaction
        */
        execute(interaction, client) {
        try {
            const channel = interaction.options.getChannel("channel") || interaction.channel;
            if (!channel) return interaction.reply({ content: `<:VS_cancel:1006609599199186974> No se pudo encontrar el canal en este servidor de discord`, ephemeral: true });
            const embed = new Discord.EmbedBuilder()
            .setTitle(`🛡️ Nuke Sistema`)
            .setDescription(`*¿Estas seguro de que quieres nukear el canal **${channel}**?*`)
            .setColor("Random")
            .setTimestamp()
            .setFooter({text:`Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId("nuke")
                .setLabel("Nuke")
                .setEmoji(`✅`)
                .setStyle(ButtonStyle.Danger),
                new Discord.ButtonBuilder()
                .setCustomId("cancel")
                .setEmoji(`🛑`)
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Secondary)
            )
            interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            console.log(chalk.redBright(`[Comando]`) + chalk.whiteBright(` Se ha usado el comando nuke en ${interaction.guild.name} con id ${interaction.guild.id} por ${interaction.user.tag} con id ${interaction.user.id}`));
            const filter = (button) => button.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            collector.on("collect", async (button) => {
                if (button.customId === "nuke") {
                    const position = channel.position;
                    const newChannel = await channel.clone();
                    await channel.delete();
                    newChannel.setPosition(position);
                    newChannel.send({ content: `🛡️ Canal nukeado por ${interaction.user} de manera correcta` })
                    button.update({ embeds: [embed], components: [] });
                } 
                if (button.customId === "cancel") {
                    button.update({ embeds: [embed], components: [] });
                }
            });
        } catch (e) {
            interaction.reply({embeds: [new EmbedBuilder()
            .setTitle(`<:VS_cancel:1006609599199186974> New status code invalid?`)
            .setDescription(`\`\`\`yml\n${e}\`\`\``)
            .setColor("Random")
            .setFooter({text:`Error en el comando nuke`})], ephemeral: true})
            console.log(chalk.redBright(`[Error]`) + chalk.whiteBright(`Se ha usado el comando nuke en ${interaction.guild.name} con id ${interaction.guild.id} por ${interaction.user.tag} con id ${interaction.user.id}`));
          }
    }
}
