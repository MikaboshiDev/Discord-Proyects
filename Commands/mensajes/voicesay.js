const { EmbedBuilder, Message, SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { getAudioUrl } = require('google-tts-api');
const {
    createAudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    getVoiceConnection
} = require('@discordjs/voice');
module.exports = {
    botpermisos: [
        "Connect",
        "Speak",
        "UseVAD",
        "SendMessages",
    ],
    data: new SlashCommandBuilder()
        .setName('voicesay')
        .setDescription('🤩 Habla con voz de google en un canal de voz en diferentes idiomas')
            .addStringOption(option =>
                option
                    .setName('texto')
                    .setDescription('Texto a decir en el canal de voz')
                    .setRequired(true)
                    .setMaxLength(200)
                )
            .addStringOption(option =>
                option
                    .setName('idioma')
                    .setDescription('Idioma a usar para hablar en el canal de voz')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Español', value: 'es' },
                        { name: 'Inglés', value: 'en' },
                        { name: 'Francés', value: 'fr' },
                        { name: 'Italiano', value: 'it' },
                        { name: 'Alemán', value: 'de' },
                        { name: 'Japonés', value: 'ja' },
                        { name: 'Coreano', value: 'ko' },
                    )
                ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const texto = interaction.options.getString('texto');
        const idioma = interaction.options.getString('idioma');
        switch (idioma) {
            case 'es': {
                const url = await getAudioUrl(texto, {
                    lang: 'es-ES',  
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje despues de 5 segundos */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'en': {
                const url = await getAudioUrl(texto, {
                    lang: 'en-US',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'fr': {
                const url = await getAudioUrl(texto, {
                    lang: 'fr-FR',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'it': {
                const url = await getAudioUrl(texto, {
                    lang: 'it-IT',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'de': {
                const url = await getAudioUrl(texto, {
                    lang: 'de-DE',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'ja': {
                const url = await getAudioUrl(texto, {
                    lang: 'ja-JP',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
            case 'ko': {
                const url = await getAudioUrl(texto, {
                    lang: 'ko-KR',
                    slow: false,
                });

                const entrada = interaction.member.voice.channel;
                if (!entrada) return interaction.reply({ content: '<a:error:1030716002259980318> Debes estar en un canal de voz para usar este comando', ephemeral: true });

                /* Conectar a Canal de Voz */
                let connection = getVoiceConnection(interaction.guild.id);
                if (!connection) {
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(url);
                connection.subscribe(player);
                /* Reproduciendo Mensaje despues de 2 segundos */
                setTimeout(() => {
                    player.play(resource);
                    interaction.reply({ content: '<a:yes:1028005786112245770> Reproduciendo mensaje en el canal de voz', ephemeral: true });
                }, 2000);

                /* Desconectar de Canal una Vez Acabado el Mensaje */
                player.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'idle') {
                        setTimeout(() => {
                            connection.destroy();
                        }, 5000);
                    }
                });
            }
            break;
        }
    }
}
