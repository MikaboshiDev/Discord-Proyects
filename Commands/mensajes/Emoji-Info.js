        const emojis = interaction.options.getString("emoji");
        const emojiRegex = /<a?:\w+:\d+>/g;
        const emojiArray = emojis.match(emojiRegex);
        if (!emojiArray)
          return interaction.reply({
            content: `<a:error:1030716002259980318> No se encontro ningun emoji`,
            ephemeral: true,
          });
        const emoji_id = emojis.split(":")[2].replace(">", "");
        const emoji = client.emojis.cache.get(emoji_id);
        if (!emoji)
          return interaction.reply({
            content: `<a:error:1030716002259980318> Tienes que poner un emoji del servidor valido`,
            ephemeral: true,
          });
        const emoji_name = emoji.name;
        const emoji_animated = emoji.animated;
        const emoji_url = emoji.url;
        const emoji_identifier = emoji.identifier;
        const emoji_link = `https://cdn.discordapp.com/emojis/${emoji_id}.${emoji_animated ? "gif" : "png"
          }`;
        const e = new Discord.EmbedBuilder()
          .setTitle(`EMOJI INFO ${emoji_id}:`)
          .addFields(
            { name: `Nombre:`, value: `\`\`\`js\n${emoji_name}\`\`\``, inline: true },
            { name: `ID:`, value: `\`\`\`js\n${emoji_id}\`\`\``, inline: true },
            { name: `Link:`, value: `\`\`\`js\n${emoji_link}\`\`\`` },
            {
              name: `Identificador:`,
              value: `\`\`\`js\n${emoji_identifier}\`\`\``,
            },
            {
              name: `Animado:`,
              value: `\`\`\`js\n${emoji_animated ? "Si" : `No`}\`\`\``,
            }
          )
          .setColor(`Random`)
          .setThumbnail(emoji_url);

        const jumb = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel("jumbo")
              .setCustomId("jumbo")
              .setStyle(Discord.ButtonStyle.Success)
              .setEmoji(emoji_id)
          )

        interaction.reply({ embeds: [e], components: [jumb], ephemeral: true });
        const filter = (i) => i.customId === "jumbo" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on("collect", async (i) => {
          if (i.customId === "jumbo") {
            const e = new Discord.EmbedBuilder()
              .setTitle(`EMOJI PNG JUMBO:`)
              .setImage(emoji_url)
              .setColor(`Random`);
            interaction.editReply({ embeds: [e], ephemeral: true });
          }
        })
      }
    }
