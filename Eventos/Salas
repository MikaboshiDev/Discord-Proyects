const { ChannelType, VoiceState } = require("discord.js")
module.exports = {
    name: "voiceStateUpdate",
    /**
    * @param {VoiceState} oldState 
    * @param {VoiceState} newState 
    */
    async execute(oldState, newState, client) {

        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const joinToCreate = "";

        if (oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {
            const voiceChannel = await guild.channels.create({
                name: member.user.tag,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: member.id, allow: ["Connect", "ManageChannels"] },
                    { id: guild.id, allow: ["Connect"] }
                ]
            })

            /* Definicion de Permisos del Canal */
            client.voiceGenerator.set(member.id, voiceChannel.id);
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 30 * 1000);
            return setTimeout(() => member.voice.setChannel(voiceChannel), 500)
        }

            /* Owner del Canal Creado */
            const ownerCanal = client.voiceGenerator.get(member.id);

            /* Eliminar Canal Creado */
            if (ownerCanal && oldChannel.id == ownerCanal && (!newChannel || newChannel.id !== ownerCanal)) {
            client.voiceGenerator.set(member.id, null);
            oldChannel.delete().catch(() => { });
        }
    }
}
