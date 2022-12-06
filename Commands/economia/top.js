const Discord = require("discord.js");
const ecoSchema = require(`${process.cwd()}/Schemas/economia/economia.js`);
var medallas = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
    4: ":chart_with_upwards_trend:",
    5: ":chart_with_upwards_trend:"
}
const data = {
    name: "top",
    description: "Sirve para ver el top de economia",
    toJSON: () => ({ ...data }),
}
module.exports = {
    data,
    ...data,
    async execute(interaction, client) {
        const total = await ecoSchema.find();
        await interaction.guild.members.fetch();
        const ordenado = total.filter(member => interaction.guild.members.cache.get(member.userID)).sort((a, b) => Number((b.dinero + b.banco) - (a.dinero + a.banco)));
        const texto = ordenado.map((miembro, index) => `${medallas[index + 1] ?? ""} \`${index + 1}\` - <@${miembro.userID}> *\`${interaction.guild.members.cache.get(miembro.userID).user.tag}\`*\n**Efectivo:** \`${miembro.dinero}\`\n**Banco:** \`${miembro.banco}\`\n\n`)
        
        var elementos_por_pagina = 5
        var dividido = elementos_por_pagina
        for (let i = 0; i < texto.length; i += dividido) {
            let desc = texto.slice(i, elementos_por_pagina);
            elementos_por_pagina += dividido;
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(":moneybag: | Top con mas dinero en el servidor")
                        .setDescription(desc.join(" "))
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setFooter({ text: `¡Top de la economia! | Powered by: ${client.user.username}`})
                        .setColor("Aqua")
                ]
            })
        } 
    } 
}
