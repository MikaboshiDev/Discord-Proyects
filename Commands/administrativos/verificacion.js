const mongoose = require("mongoose");
const Discord = require("discord.js");
const {
    EmbedBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType } = require('discord.js');
const roleSchema = require("../../Schemas/verificacion/verificacion");
const chalk = require("chalk");
module.exports = {
    permisos: [
        "Administrator"
    ],
    botpermisos: [
        "ManageGuild",
        "ManageChannels",
        "SendMessages",
        "EmbedLinks",
        "ManageMessages"
    ],
    data: new SlashCommandBuilder()
        .setName("setups")
        .setDescription("🎉 Configura los setups del servidor.")
        .addSubcommand((options) =>
            options
                .setName("verification")
                .setDescription(
                    "🎉 Configura los canales de verificacion del servidor."
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Canal al que enviar el mensaje.")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Mensaje que tendra el setup de verificacion.")
                        .setRequired(false)
                        .setMinLength(5)
                        .setMaxLength(300)
                )
                .addStringOption((option) =>
                    option
                        .setName("titulo")
                        .setDescription("titulo del mensaje de verificacion")
                        .setRequired(false)
                        .setMinLength(5)
                        .setMaxLength(60)
                )
        )
        .addSubcommand((options) =>
            options
                .setName("roles")
                .setDescription("🥏 Configura el rol de verificacion del servidor.")
                .addRoleOption((option) =>
                    option
                        .setName("rol")
                        .setDescription("Rol para establecer el rol de verificacion en.")
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "verification":
                {
                    const channel = interaction.options.getChannel("channel");
                    const description = interaction.options.getString("message");
                    const title = interaction.options.getString("titulo");
                    const embed = new EmbedBuilder()
                        .setDescription(description || "Welcome to the server! Please authorize yourself by clicking the button below! When you verify you will be granted the 'verified' role")
                        .setColor("Navy")
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle(title || `Welcome to ${interaction.guild.name}!`);

                    const button = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setCustomId("verifyMember")
                                .setLabel("Verificacion")
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji("<:dev_yes:999673591341797416>")
                        );

                    channel.send({ embeds: [embed], components: [button] }).catch((error) =>
                        console.log(chalk.redBright(`[SISTEMA]`) + ` Se a encontrado un error en uno de los setups del bot en el servidor [${interaction.guild.id}]...`));
                    interaction.reply({ content: `<a:yes:1028005786112245770> El sistema de verificacion a sido agregado de forma correcta en caso de errores contacta a mi soporte`, ephemeral: true }).catch((error) =>
                        console.log(chalk.redBright(`[SISTEMA]`) + ` Se a encontrado un error en uno de los setups del bot en el servidor [${interaction.guild.id}]...`));
                }
                break;
            case "roles":
                {
                    let role = interaction.options.getRole("rol");
                    const roleId = await roleSchema.findOne({ roleId: role.id });

                    if (!roleId) {
                        verifyRole = await new roleSchema({
                            _id: mongoose.Types.ObjectId(),
                            guildId: interaction.guild.id,
                            roleId: role.id,
                        });

                        await verifyRole.save().catch(console.error);
                        await interaction.reply({
                            content: `Successfully set the verification role to ${role.name}!`,
                            ephemeral: true
                        })
                    } else {
                        await verifyRole.save().catch(console.error);
                        await interaction.reply({
                            content: 'The role is already in the database!',
                            ephemeral: true
                        })
                    }
                }
                break;
        }
    },
};
