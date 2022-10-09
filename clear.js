const {
    EmbedBuilder,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ButtonStyle
  } = require("discord.js");
const Discord = require(`discord.js`);
const chalk = require("chalk");
module.exports = {
    permisos: ["ManageMessages"],
    botpermisos: ["ManageMessages", "SendMessages", "EmbedLinks"],
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("⛳ Borra un numero de mensajes de un usuario o canal del servidor")
        .addNumberOption((option) => option.setName("cantidad").setDescription("Cantidad de mensajes a borrar").setRequired(true))
        .addUserOption((option) => option.setName("usuario").setDescription("Usuario del que borrar los mensajes").setRequired(false)),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, options, message } = interaction;

        const Amount = options.getNumber("cantidad");
        if(Amount > 100) return interaction.reply({content: `<:VS_cancel:1006609599199186974> No puedes borrar mas de 100 mensajes`, ephemeral: true});
        if(Amount < 1) return interaction.reply({content: `<:VS_cancel:1006609599199186974> No puedes borrar menos de 1 mensajes`, ephemeral: true});
        const Target = options.getMember("usuario");
        const Messages = await channel.messages.fetch();
        const Response = new EmbedBuilder()
        .setColor("Random");
        if(Target) {
            let i = 0;
            const filtered =[];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {filtered.push(m); i++;}})
        try {
            await channel.bulkDelete(filtered, true).then(messages => {
                Response
                .setTitle("🛡️ Mensajes borrados")
                .setDescription(`*⛔ Se han borrado **${messages.size}** mensajes de **${Target}** con exito.*`);
                interaction.reply({embeds: [Response], ephemeral: true})})
                console.log(chalk.redBright(`[Comando]`) + chalk.whiteBright(` Se ha usado el comando clear en ${interaction.guild.name} por ${interaction.user.tag}`));
        }  catch (e) {
            interaction.reply({embeds: [new EmbedBuilder()
            .setTitle(`<:VS_cancel:1006609599199186974> New status code invalid 14 days messages?`)
            .setDescription(`\`\`\`yml\n${e}\`\`\``)
            .setColor("Random")
            .setFooter({text:`Error en el comando avatar`})], ephemeral: true})
            console.log(`${chalk.redBright("[🛑] Error en el comando clear: ")}`)}   
        } else {
        try {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response
                .setTitle("🛡️ Mensajes borrados")
                .setDescription(`*⛔ Se han borrado **${messages.size}** mensajes del canal exitosamente*`);
                interaction.reply({embeds: [Response], ephemeral: true})})
                console.log(chalk.redBright(`[Comando]`) + chalk.whiteBright(` Se ha usado el comando clear en ${interaction.guild.name} con id ${interaction.guild.id} por ${interaction.user.tag} con id ${interaction.user.id}`));
            }  catch (e) {
            interaction.reply({embeds: [new EmbedBuilder()
            .setTitle(`<:VS_cancel:1006609599199186974> New status code invalid 14 days messages??`)
            .setDescription(`\`\`\`yml\n${e}\`\`\``)
            .setColor("Random")
            .setFooter({text:`Error en el comando avatar`})], ephemeral: true})
            console.log(`${chalk.redBright("[🛑] Error en el comando clear: ")}`)
            }   
        }
    }
}
