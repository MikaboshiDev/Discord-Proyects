const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const MC = require("minecraft-server-util");
module.exports = {
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;

        const IP = options.getString("ip");
        const Port = options.getNumber("port");

        const Embed = new EmbedBuilder()
            .setColor("#1ad4a8")
            .setTitle("</> | Stats Servidor Minecraft")
            .setFooter({ text: `Peticion de Minecraft IP: ${IP}`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

        MC.status(IP, parseInt(Port)).then((response) => {
            Embed.setDescription(`\`🔥\` Server IP: \`${IP}\`\n\`⌛\` Server Port: \`${parseInt(Port)}\`\n\`⏱️\` Server Motd: ${response.motd.clean}\n\`🌊\` Server Players: \`${response.players.online}\`\n\`🔒\` Server Max Players\`${response.players.max}\`\n\`🌐\` Server Version: \`${response.version.name}\``)
            interaction.reply({ embeds: [Embed] }).catch((err) => { });
        }).catch((err) => {
            interaction.editReply({ embeds: [Embed.setColor("Red").setDescription(`:error: There was an error, check the server IP and Port.\n> \n> Error: ${err}`)] }).catch((err) => { });
        })
    },
};
