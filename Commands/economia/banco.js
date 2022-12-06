const Discord = require('discord.js');
const { asegurar_todo } = require(`${process.cwd()}/Tools/funciones.js`);
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "banco",
    description: "Sirve para ver la cartera de un Usuario",
    options: [
        {
            name: "usuario",
            description: "Menciona un usuario para ver su estado de banco",
            type: 6,
            required: false
        }
    ],  toJSON: () => ({ ...data }),

}
module.exports = {
    data,
    ...data,
    async execute(interaction, client) {
        const user = interaction.options.getUser("usuario") || interaction.user;
        if (user.bot) return interaction.reply({ content: `❌ | Los bots no pueden tener dinero` });
        const data = await ecoSchema.findOne({ userID: user.id });
        if (!data) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`❌ | Este usuario no tiene una cuenta bancaria creada`)
                .setColor("Random")
                .setFooter({ text: `¡Cuenta de banco! | Powered by ${client.user.username}` })]
        })
        await asegurar_todo(null, user.id);

        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`:moneybag: › ¡Panel bancario!`)
                .setDescription(`¡Hola, este es el estado de cuenta de ${user}!`)
                .addFields(
                    {
                        name: `:dollar: › Efectivo`, value: `\`${data.dinero} en efectivo\``
                    },
                    {
                        name: `:bank: › Banco`, value: `\`${data.banco} en banco\``
                    }
                )
                .setFooter({ text: `¡Estado de cuenta! | Powered by: ${client.user.username}` })
                .setColor("Random")
            ]
        });
    }
}