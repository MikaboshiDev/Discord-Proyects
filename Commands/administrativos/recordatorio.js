const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
  } = require("discord.js");
  const schedule = require("node-schedule");
const lenguaje = require("../../../Model/servidor/servidor");

  module.exports = {
    botpermisos: [
      "SendMessages", 
      "EmbedLinks", 
      "ManageChannels"
    ],
    developer: true,
    data: new SlashCommandBuilder()
      .setName("recordatorio")
      .setNameLocalizations({
        "fr": "rappel",
        "en-US": "reminder",
      })
      .setDescription("📡 Establecer un recordatorio de mensaje")
      .setDescriptionLocalizations({
        "fr": "📡 Définir un rappel de message",
        "en-US": "📡 Set a message reminder",
      })
      .addStringOption((option) => {
        return option
          .setName("mensaje")
          .setNameLocalizations({
            "fr": "message",
            "en-US": "message",
          })
          .setDescription("El mensaje a recordar")
          .setDescriptionLocalizations({
            "fr": "Le message à retenir",
            "en-US": "The message to remember",
          })
          .setRequired(true)
          .setMaxLength(2000)
          .setMinLength(10);
      }
    )
      .addIntegerOption((option) => {
        return option
          .setName("tiempo")
          .setNameLocalizations({
            "fr": "météo",
            "en-US": "time"
          })
          .setDescription("La hora a la que enviar el mensaje. (EN MINUTOS)")
          .setDescriptionLocalizations({
            "fr": "L'heure à laquelle envoyer le message. (EN MINUTES)",
            "en-US": "The time to send the message. (IN MINUTES)"
          })
          .setRequired(true)
          .setMinValue(1);
      }
    ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      const message = interaction.options.getString("mensaje");
      const time = interaction.options.getInteger("tiempo");
      const data = await lenguaje.findOne({ GuildID: interaction.guild.id });
      let ls = data.idioma

      if (time >= 525960 * 1000) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(client.la[ls]["cmds"]["recordatorio"]["variable1"])
              .setColor(client.color)],
        })}
  
      const timeMs = time * 60000;
      const date = new Date(new Date().getTime() + timeMs);
  
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: eval(client.la[ls]["cmds"]["recordatorio"]["variable2"]), iconURL: interaction.user.avatarURL() })
            .setFooter({ text: eval(client.la[ls]["cmds"]["recordatorio"]["variable2"]), iconURL: interaction.user.avatarURL() })
            .addFields(
              { name: client.la[ls]["cmds"]["recordatorio"]["fields"]["field1"]["name"], value: eval(client.la[ls]["cmds"]["recordatorio"]["fields"]["field1"]["value"]), inline: true },
              { name: client.la[ls]["cmds"]["recordatorio"]["fields"]["field2"]["name"], value: eval(client.la[ls]["cmds"]["recordatorio"]["fields"]["field2"]["value"]), inline: true })],
            ephemeral: true,
      });
  
      // schedule and send the message.
      schedule.scheduleJob(date, async () => {
        await interaction.member.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: eval(client.la[ls]["cmds"]["recordatorio"]["variable3"]), iconURL: interaction.user.avatarURL() })
              .setFooter({ text: eval(client.la[ls]["cmds"]["recordatorio"]["variable3"]), iconURL: interaction.user.avatarURL() })
              .setDescription(eval(client.la[ls]["cmds"]["recordatorio"]["variable4"])).setColor(client.color)],
          });
      });
  }};