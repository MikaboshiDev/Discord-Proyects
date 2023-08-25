const version = require('../../package.json');
const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { connection } = require("mongoose");
const os = require("os");
const chalk = require("chalk");
module.exports = {
    name: "ready",
    async execute(client) {
        const edit_msg_config = {
            channel_id: "",
            message_id: "",
        }

        var CronJob = require('cron').CronJob;
        var job = new CronJob('0 */1 * * *', function () {
            edit_msg(client) 
        }, null, true, 'Europe/Berlin');
        job.start();

        async function edit_msg(client) {
            let channel = await client.channels.fetch(edit_msg_config.channel_id); 
            let message = await channel.messages.fetch(edit_msg_config.message_id); 
            const startUsage = process.cpuUsage();
            const now = Date.now();
            while (Date.now() - now < 500);
            let userUsage = process.cpuUsage(startUsage).user / 1000;
            let sysUsage = process.cpuUsage(startUsage).system / 1000 || 0;

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${client.user.tag}'s Information`, iconURL: `https://cdn.discordapp.com/attachments/992251291214545026/998974029614567515/d9cb1a809bcc4b1b915f40c784e9b365.png` })
                .setDescription(`**Prefix:** \`/\``)
                .setThumbnail(`https://cdn.discordapp.com/attachments/992251291214545026/998974029614567515/d9cb1a809bcc4b1b915f40c784e9b365.png`)
                .setColor('Random')
                .setTimestamp()
                .addFields(
                    { name: `\`•\` Total Server(s): [${client.guilds.cache.size}]`, value: `\`\`\`yml\nNames: ${client.user.tag}\`\`\``, inline: true },
                    { name: `\`•\` Version:`, value: `\`\`\`yml\n${version.version}\`\`\``, inline: true },
                    { name: `\`•\` Node Version:`, value: `\`\`\`yml\n${process.version}\`\`\``, inline: true },
                    { name: `\`•\` Total User(s): [${client.users.cache.size}]`, value: `\`\`\`yml\n${client.users.cache.size}\`\`\``, inline: true },
                    { name: `\`•\` Total Channel(s): [${client.channels.cache.size}]`, value: `\`\`\`yml\n${client.channels.cache.size}\`\`\``, inline: true },
                    { name: `\`•\` Total Command(s): [${client.commands.size}]`, value: `\`\`\`yml\n${client.commands.size}\`\`\``, inline: true },
                    { name: `\`•\` Total Category(s): [${readdirSync('./Commands/').length}]`, value: `\`\`\`yml\n${readdirSync('./Commands/').length}\`\`\``, inline: true },
                    { name: `\`•\` Total Role(s): [${client.guilds.cache.reduce((a, g) => a + g.roles.cache.size, 0)}]`, value: `\`\`\`yml\n${client.guilds.cache.reduce((a, g) => a + g.roles.cache.size, 0)}\`\`\``, inline: true },
                    { name: `\`•\` Total Bot(s): [${client.guilds.cache.reduce((a, g) => a + g.members.cache.filter(m => m.user.bot).size, 0)}]`, value: `\`\`\`yml\n${client.guilds.cache.reduce((a, g) => a + g.members.cache.filter(m => m.user.bot).size, 0)}\`\`\``, inline: true },
                    { name: `\`•\` Total Member(s): [${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}]`, value: `\`\`\`yml\n${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\`\``, inline: true },
                    { name: `\`•\` Total Human(s): [${client.guilds.cache.reduce((a, g) => a + g.members.cache.filter(m => !m.user.bot).size, 0)}]`, value: `\`\`\`yml\n${client.guilds.cache.reduce((a, g) => a + g.members.cache.filter(m => !m.user.bot).size, 0)}\`\`\``, inline: true },
                    { name: `\`•\` Platform`, value: `\`\`\`yml\n${process.platform}\`\`\`` },
                    { name: `\`•\` CPU Usage:`, value: `\`\`\`yml\nUser: ${userUsage} MB\nSystem: ${sysUsage} MB\`\`\`` }
                );

            message.edit({
                embeds: [embed]
            }) 
            console.log(chalk.cyanBright("[ Estatus - Bots ]") + ` Your New Message Created at: ${String(new Date).split(" ", 5).join(" ")}`)
        }
    },
};
