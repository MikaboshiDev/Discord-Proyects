/*
# Discord Server: https://discord.gg/pgDje8S3Ed
# Github: https://github.com/MikaboshiDev
# Docs: https://bit.ly/nightdevelopment
# Dashboard: https://bit.ly/nightdashboard

# Created by: MikaboshiDev
# Version: 1.0.0
# Discord: azazel_hla

# This file is the main configuration file for the bot.
# Inside this file you will find all the settings you need to configure the bot.
# If you have any questions, please contact us on our discord server.
# If you want to know more about the bot, you can visit our website.
*/

const { WebhookClient, Client, EmbedBuilder } = require("discord.js");
const api = "https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json";
const { logWithLabel } = require("../manager/prefijos.js");
const { DateTime } = require('luxon');
const fetch = require('node-fetch');
const jsyml = require("js-yaml");
const fs = require("fs");

const impactEmojis = {
    critical: "🔴",
    major: "🟠",
    minor: "🟡",
    resolved: "✅",
    postmortem: "📋",
};

module.exports = (client) => {
    client.on("ready", () => {
        const webhook = new WebhookClient({
            id: "",
            token: "",
        });

        async function embedFromIncident(incident) {
            const impactEmoji = impactEmojis[incident.impact] || "❔";

            const embed = new EmbedBuilder()
                .setColor(incident.status === 'resolved' || incident.status === 'postmortem' ? "Green" : "Red")
                .setTimestamp(new Date(incident.started_at))
                .setURL(incident.shortlink)
                .setTitle(incident.name)
                .setFooter({ text: `Incident ${incident.id} ${impactEmoji}`, iconURL: 'https://i.imgur.com/8DKwbhj.png' });

            for (const update of incident.incident_updates.reverse()) {
                const updateDT = DateTime.fromISO(update.created_at);
                const timeString = `<t:${Math.floor(updateDT.toSeconds())}:R>`;
                const authorName = update.author ? update.author.name : "Unknown Author";

                embed.addFields({
                    name: `${update.status.charAt(0).toUpperCase() + update.status.slice(1)} ${impactEmoji} (${timeString})`,
                    value: update.body
                });
            }

            const descriptionParts = [`• Impact: ${incident.impact}`];

            if (incident.components.length) {
                const affectedNames = incident.components.map((c) => c.name);
                descriptionParts.push(`• Affected Components: ${affectedNames.join(', ')}`);
            }

            embed.setDescription(descriptionParts.join('\n'));

            return embed;
        }

        async function updateIncident(incident, messageID) {
            try {
                const embed = await embedFromIncident(incident);
                const message = await (messageID
                    ? webhook.editMessage({ embeds: [embed] }, messageID)
                    : webhook.send({ embeds: [embed] }));

                logWithLabel("debug", `Updated incident ${incident.id} with message ${message.id}`);
            } catch (error) {
                if (messageID) {
                    logWithLabel("api_discord", `Error during hook editing on incident ${incident.id}\n${error}`);
                } else {
                    logWithLabel("api_discord", `Error during hook sending on incident ${incident.id}\n${error}`);
                }
            }
        }

        async function check() {
            logWithLabel("info", "Checking for new incidents");
            try {
                const json = await fetch(api).then((r) => r.json());
                const { incidents } = json;

                for (const incident of incidents.reverse()) {
                    const data = await webhook.fetchMessage(incident.id).catch(() => null);
                    if (!data) {
                        logWithLabel("debug", `Incident ${incident.id} created`);
                        await updateIncident(incident);
                    } else {
                        const incidentUpdate = DateTime.fromISO(incident.updated_at || incident.created_at);
                        if (DateTime.fromISO(data.lastUpdate) < incidentUpdate) {
                            logWithLabel("debug", `Incident ${incident.id} updated`);
                            await updateIncident(incident, data.messageID);
                        }
                    }
                }
            } catch (error) {
                logWithLabel("api_discord", `Error during incident check\n${error}`);
            }
        }

        check();
        setInterval(check, 60_000 * 5);
    });
};
