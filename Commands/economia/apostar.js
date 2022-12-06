const Discord = require("discord.js");
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "apostar",
    description: "Sirve para apostar una cantidad de dinero",
    options: [
        {
            name: "cantidad",
            description: "Cantidad que apostaras",
            type: 3,
            required: true
        }
    ],  toJSON: () => ({ ...data }),
}
module.exports = {
    data,
    ...data,
    async execute (interaction, client) {
        let data = await ecoSchema.findOne({ userID: interaction.user.id });
        const cantidad = interaction.options.getString("cantidad")

            if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({content: `❌ | No has especificado una cantidad válida para apostar`, ephemeral: true});
            if (cantidad > data.dinero) return interaction.reply({content: `❌ | No tienes tanto efectivo para apostar`});
        let posibildades = ["ganar", "perder"];
        let resultado = posibildades[Math.floor(Math.random() * posibildades.length)];
        if (resultado === "ganar") {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    dinero: +cantidad
                }
            })
            return interaction.reply({embeds: [new Discord.EmbedBuilder()
                .setTitle(`:slot_machine: | Mesa de apuestas `)
                .setDescription(`¡Felicidades!, has ganado la apuesta y te ganas \`${cantidad}\` en efectivo`)
                .setThumbnail("https://cdn.discordapp.com/attachments/975205886874251334/1020516845142421544/apuestas-apuesta.gif")
                .setTimestamp()
                .setFooter({text: `¡Mesa de apuestas! | Powered by: ${client.user.username}`})
                .setColor("Random")
            
            ]
        })
        } else {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    dinero: -cantidad
                }
            })
            return interaction.reply({embeds: [new Discord.EmbedBuilder()
                .setTitle(`:slot_machine: | Mesa de apuestas `)
                .setDescription(`¡Que triste!, has perdido la apuesta y te restan \`${cantidad}\` en efectivo`)
                .setThumbnail("https://cdn.discordapp.com/attachments/975205886874251334/1020516845142421544/apuestas-apuesta.gif")
                .setTimestamp()
                .setFooter({text: `¡Mesa de apuestas! | Powered by: ${client.user.username}`})
                .setColor(client.color)
            
            ]
        })
        }
    }
}
