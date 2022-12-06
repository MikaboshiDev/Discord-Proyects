const Discord = require('discord.js')
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const duration = require('humanize-duration');
var trabajos = [
    "Empresario/a",
    "desarrollador/a",
    "Mecánico/a",
    "Taxista",
    "Médico",
    "Obrero/a",
    "Profesor/a",
    "Ejecutivo",
    "Investigador/a del crimen",
    "Inmobiliario/a"
];
const data = {
    name: "trabajar",
    description: "Sirve para trabajar y conseguir dinero cada 3 horas",
    toJSON: () => ({ ...data }),
}
module.exports = {
    data,
    ...data,
    async execute(interaction, client) {
        let data = await ecoSchema.findOne({ userID: interaction.user.id });
        let tiempo_ms = 3 * 60 * 60 * 1000 // 10800000 ms
        let recompensa = Math.floor(Math.random() * 1200) + 300;
        let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
        if (tiempo_ms - (Date.now() - data.work) > 0) {
            let tiempo_restante = duration(Date.now() - data.work - tiempo_ms,
                {
                    language: "es",
                    units: ["h", "m", "s"],
                    round: true,
                })
            return interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setDescription(`:watch: Has trabajado demasiado hoy, debes esperar \`${tiempo_restante}\`  para volver a trabajar`)
                    .setColor("Random")]
            })
        }
        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                dinero: recompensa
            },
            work: Date.now()
        })
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`*Información sobre tu trabajo de hoy*`)
                .addFields(
                    {
                        name: `:page_with_curl: Trabajo`, value: `\`${trabajo}\``
                    },
                    {
                        name: `:coin: Sueldo de hoy`, value: `\`${recompensa} en efectivo\``
                    }
                )
                .setColor("Random")
                .setFooter({text: `¡Trabajos! | Powered by: ${client.user.username}`})
                .setTimestamp()
            ]
        })
    }
}