const Discord = require('discord.js')
const { asegurar_todo } = require(`${process.cwd()}/Tools/funciones.js`);
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
const data = {
    name: "transferir",
    description: "Sirve para enviar dinero a otro usuario",
    options: [
        {
            name: "usuario",
            description: "Usuario al que vas a transferirle",
            type: 6,
            required: true
        },
        {
            name: "cantidad",
            description: "Cantidad que enviarás al usuario",
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

        const usuario = interaction.options.getUser("usuario")
        if (usuario == interaction.user) return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`❌ | No puedes transferirte dinero a ti mismo`)
                .setColor("Random")]
        })
        if (usuario.bot) return interaction.reply({ content: `❌ | Un bot no puede tener dinero`, ephemeral: true });
        await asegurar_todo(null, usuario.id);

        const cantidad = interaction.options.getString("cantidad")
        if (isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return interaction.reply({ content: `❌ | No has especificado una cantidad válida para enviar`, ephemeral: true });
        if (cantidad > data.banco) return interaction.reply({ content: `❌ | Debes tener el dinero en el banco o no tienes tanto dinero para enviar`, ephemeral: true });


        await ecoSchema.findOneAndUpdate({ userID: usuario.id }, {
            $inc: {
                banco: +cantidad
            },
            rob: Date.now()
        })
        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                banco: -cantidad
            },
        })

        client.users.cache.get(`${usuario.id}`).send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(":inbox_tray: | ¡Has recibido una transferencia!")
                .setDescription(`¡Hola ${usuario}!\n\nEl usuario ${interaction.user} te ha enviado una transferencia de \`${cantidad}\` monedas.\n\n*Ya está disponible en tu cuenta de banco*`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `¡Economia! | Powered By ${client.user.username}` })
                .setTimestamp()
                .setColor("Random")
            ]
        })
        return interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`:incoming_envelope: | Transferencia exitosa`)
                .setDescription(`¡Información sobre la transferencia!`)
                .addFields(
                    {
                        name: ":outbox_tray: | Usuario que envia", value: `\`${interaction.user.tag}\``
                    },
                    {
                        name: ":inbox_tray: | Usuario que recibe", value: `\`${usuario.tag}\``
                    },
                    {
                        name: ":dollar: | Cantidad que envia", value: `\`${cantidad}\``
                    },
                    {
                        name: ":dollar: | Cantidad que recibe", value: `\`${cantidad}\``
                    }
                )
                .setDescription(`*La transferencia es visible desde la hora que se envia*`)
            .setColor("Random")
        .setFooter({text: `¡Economia! | Powered by ${client.user.username}`})]
        })
    }
}
