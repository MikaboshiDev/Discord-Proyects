const {
    EmbedBuilder,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ButtonStyle
} = require("discord.js");
const Discord = require(`discord.js`);
const chalk = require("chalk");
module.exports = {
    permisos: [
        "SendMessages", 
        "EmbedLinks",
    ],
    data: new SlashCommandBuilder()
        .setName("")
        .setDescription(""),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        try {

            const embed = new Discord.EmbedBuilder()
                .setTitle("Diamantes RP")
                .setDescription("IP: connect cfx.re/join/63qp8j");

            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`<:VS_cancel:1006609599199186974> New status code invalid?`)
                    .setDescription(`\`\`\`yml\n${e}\`\`\``)
                    .setColor("Random")
                    .setFooter({ text: `Error en el comando` })], ephemeral: true
            })
        }
    }
}

/*
____          ____            _         _           _     
| __ ) _   _  | __ )  ___  ___| |_______| |__  _   _| |__  
|  _ \| | | | |  _ \ / _ \/ _ \ |_  / _ \ '_ \| | | | '_ \ 
| |_) | |_| | | |_) |  __/  __/ |/ /  __/ |_) | |_| | |_) |
|____/ \__, | |____/ \___|\___|_/___\___|_.__/ \__,_|_.__/ 
       |___/  
*/