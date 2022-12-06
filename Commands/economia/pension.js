const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const duration = require('humanize-duration');
const data = {
    name: "pension",
    description: "Sirve para reclamar tu pension diaria",
    toJSON: () => ({ ...data }),
}
module.exports = {
    data,
    ...data,
    async execute (interaction) {
        let data = await ecoSchema.findOne({userID: interaction.user.id});
        let tiempo_ms = 24 * 60 * 60 * 1000
        let recompensa = 800;
        if(tiempo_ms - (Date.now() - data.daily) > 0) {
            let tiempo_restante = duration(Date.now() - data.daily - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return interaction.reply({content: `🕑 | Tienes que esperar \`${tiempo_restante}\` para volver a reclamar tu pension diaria`})
        }
        await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
            $inc: {
                dinero: recompensa
            },
            daily: Date.now()
        })
        return interaction.reply({content: `Has reclamado tu pension diaria de \`${recompensa} monedas\``})
    }
}
