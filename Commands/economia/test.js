const Discord = require('discord.js')
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "añadir",
    description: "Sirve para añadirle dinero a un usuario",
    owner: true,
    options: [
        {
            name: "usuario",
            description: "Usuario al que le añadiras dinero",
            type: 6,
            required: true
        },
        {
            name: "tipo",
            description: "Selecciona entre efectivo o banco",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Efectivo", value: "Efectivo"
                },
                {
                    name: "Banco", value: "Banco"
                }
            ]
        },
        {
            name: "cantidad",
            description: "Cantidad que añadiras",
            type: 3,
            required: true
        }
    ],  toJSON: () => ({ ...data }),
}
module.exports = {
    data,
    ...data,
    async execute(interaction, client) {

        switch (interaction.options.getString('tipo')) {

            case "Banco":

                const usuario = interaction.options.getUser("usuario")
                const cantidad = interaction.options.getString("cantidad")
                if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`<:_:1021533916068323490> No has especificado una cantidad válida para añadirle al usuario`)
                        .setColor("Random")]
                })

                await ecoSchema.findOneAndUpdate({ userID: usuario.id }, {
                    $inc: {
                        banco: +cantidad
                    }
                });
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`<:_:1021524271127871528> Le has añadido la cantidad de \`${cantidad} en el banco\` al usuario \`${usuario.tag}\``)
                        .setColor("Random")
                    ]
                })

                break;
            case "Efectivo":

                const usuarioEfectivo = interaction.options.getUser("usuario")
                const cantidadEfectivo = interaction.options.getString("cantidad")
                if (isNaN(cantidadEfectivo) || cantidadEfectivo <= 0 || cantidadEfectivo % 1 != 0) return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`<:_:1021533916068323490> No has especificado una cantidad válida para añadirle al usuario`)
                        .setColor("Random")]
                });

                await ecoSchema.findOneAndUpdate({ userID: usuarioEfectivo.id }, {
                    $inc: {
                        dinero: +cantidadEfectivo
                    }
                });
                return interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`<:_:1021524271127871528> Le has añadido la cantidad de \`${cantidadEfectivo} en el banco\` al usuario \`${usuarioEfectivo.tag}\``)
                        .setColor("Random")]
                });
        }
    }
}