const Discord = require('discord.js')
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "depositar",
    description: "Sirve para depositar dinero en el banco",
    options: [
        {
            name: "cantidad",
            description: "Cantidad a depositar",
            type: 3,
            required: true
        }
    ],  toJSON: () => ({ ...data }),

}
module.exports = {
    data,
    ...data,
    async execute(interaction, client) {
        let data = await ecoSchema.findOne({ userID: interaction.user.id });
        let cantidad = interaction.options.getString("cantidad")
        if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021533916068323490> | No has especificado una cantidad válida para depositar`)
                .setColor("Random")]
        });
        if (cantidad > data.dinero) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021533916068323490> No tienes tanto dinero para depositar`)
                .setColor("Random")]
        });

        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                dinero: -cantidad,
                banco: cantidad
            }
        });
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021524271127871528> Has depositado la cantidad de \`${cantidad} en efectivo\`  en tu banco`)
                .setColor("Random")]
        }
        )
    }
}