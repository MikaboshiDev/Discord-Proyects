const Discord = require('discord.js')
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "retirar",
    description: "Sirve para sacar dinero del banco",
    options: [
        {
            name: "cantidad",
            description: "Cantidad de moneda para sacar del banco",
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
        let cantidad = interaction.options.getString("cantidad");

        if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021533916068323490> No has especificado una cantidad válida para sacar`)
                .setColor("Random")]
        })

        if (cantidad > data.banco) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021533916068323490> | No tienes tanto dinero en el banco para sacar`)
                .setColor("Random")]
        });

        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                banco: -cantidad,
                dinero: cantidad,
            }
        });
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`<:_:1021524271127871528> Has sacado la cantidad de \`${cantidad} en efectivo\` de tu banco`)
                .setColor("Random")]
        });
    }
}