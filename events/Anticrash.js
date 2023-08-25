const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const chalk = require("chalk");
const webhook = new WebhookClient({
    url: "url de tu webhook"
});

module.exports = (client) => {
    const embed = new EmbedBuilder()
        .setColor("Red");

    client.on("error", (err) => {
      

        embed
            .setTitle("Discord API Error")
            .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
            .setDescription(`\`\`\`js\n${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
      

        embed
            .setTitle("Unhandled Rejection/Catch")
            .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
            .addFields(
                {
                    name: `<a:amarillo:1026468389675335760> Reason`,
                    value: `\`\`\`js\n${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
                },
                {
                    name: `<a:amarillo:1026468389675335760> Promise`,
                    value: `\`\`\`js\n${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtException", (err, origin) => {
      

        embed
            .setTitle("Uncaught Exception/Catch")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
            .addFields(
                {
                    name: `<a:amarillo:1026468389675335760> Error`,
                    value: `\`\`\`js\n${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
                },
                {
                    name: `<a:amarillo:1026468389675335760> Origin`,
                    value: `\`\`\`js\n${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
     

        embed
            .setTitle("Uncaught Exception Monitor")
            .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
            .addFields(
                {
                    name: `<a:amarillo:1026468389675335760> Error`,
                    value: `\`\`\`js\n${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
                },
                {
                    name: `<a:amarillo:1026468389675335760> Origin`,
                    value: `\`\`\`js\n${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });

    process.on("warning", (warn) => {

        embed
            .setTitle("Uncaught Exception Monitor Warning")
            .setURL("https://nodejs.org/api/process.html#event-warning")
            .addFields(
                {
                    name: `<a:amarillo:1026468389675335760> Warning`,
                    value: `\`\`\`js\n${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
                }
            )
            .setTimestamp();

        return webhook.send({ embeds: [embed] });
    });
};
