const prefix = require("../../config.json").prefix;
const Discord = require("discord.js");
module.exports = {
    name: "message",
    async execute(message) {
    
    //CODIGO DE TOMATO GITHUB ADAPTADO A V14 YOUTUBE NOTIFICACIONES
    
        if (message.author.bot) return;         
        if (message.content == "c!help") {
            //define help Embed
            let embed = new Discord.EmbedBuilder()
                .setTitle("All Commands")
                .setURL("https://www.npmjs.com/package/discord-youtube-poster")
                .setColor("Red")
                .addFields(
                    {name:`${prefix}set`, value:`> *Set a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGE*`},
                    {name:`${prefix}edit`, value:`> *Edit a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGEK*`},
                    {name:`${prefix}remove`, value:`> *Delete/Remove a setup Channel by a CHANNELLINK*`},
                    {name:`${prefix}get`, value:`> *Get a setup Channel by a CHANNELLINK*`},
                    {name:`${prefix}getuser`, value:`> *Get all setup Channels of a USER*`},
                    {name:`${prefix}getallchannels`, value:`> *Get all setup Channels of this Guild*`},
                    {name:`${prefix}deleteallchannels`, value:`> *Delete/Remove all setup Channels of this Guild*`},
                    {name:`${prefix}channelinfo`, value:`> *Get detailed YT-Channel-Data by a CHANNELLINK*`},
                    {name:`${prefix}latestvideos`, value:`> *Get all/latest Videos by a CHANNELLINK*`},
                    {name:`${prefix}lastvideo`, value:`> *Get the most recent uploaded Video by a CHANNELLINK*`})
                .setFooter({text:`npm i discord-youtube-poster\nDC-HELP: https://discord.gg/FQGXbypRf8`})
            //Send the Information Message
            message.channel.send({
                content: `**\`\`\`npm i discord-youtube-poster\`\`\`**\nDC-HELP: https://discord.gg/FQGXbypRf8\nhttps://www.npmjs.com/package/discord-youtube-poster\n\n**DOCS:**\nhttps://github.com/Tomato6966/discord-yt-poster/wiki/`,
                embed: [embed]
            }).then(msg => msg.react("👍"))
        }
    
        //All possible replacement formats, see them: https://github.com/Tomato6966/discord-yt-poster/wiki/Replacement Formats
        let toreplace_format =
            `**\`{videourl}\` ==> URL / LINK**` + "\n" +
            `**\`{video}\` ==> URL / LINK**` + "\n" +
            `**\`{url}\` ==> URL / LINK**` + "\n" +
            `**\`{videotitle}\` ==> TITLE / NAME**` + "\n" +
            `**\`{name}\` ==> TITLE / NAME**` + "\n" +
            `**\`{title}\` ==> TITLE / NAME**` + "\n" +
            `**\`{videoauthorname}\` ==> Channelauthor NAME**` + "\n" +
            `**\`{authorname}\` ==> Channelauthor NAME**` + "\n" +
            `**\`{author}\` ==> Channelauthor NAME**` + "\n" +
            `**\`{creator}\` ==> Channelauthor NAME**` + "\n" +
            `**\`{creatorname}\` ==> Channelauthor NAME**` + "\n" +
            `**\`{discorduser}\` ==> ID of the LINKED USER**` + "\n" +
            `**\`{user}\` ==> ID of the LINKED USER**` + "\n" +
            `**\`{member}\` ==> ID of the LINKED USER**` + "\n\n" +
            `**__DEFAULT MESSAGE:__** \`\`\`${client.YTP.options.defaults.Notification}\`\`\``;
    
    
        if (message.content === "c!set" || message.content === "c!add" || message.content === "c!youtube") {
            if (!message.member.hasPermission("Administrator")) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(":x: You are not allowed to execute this Command!")
            })
            let ChannelLink = args[0];
            let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
            let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
            let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
            let preventDuplicates = true;
            if (!ChannelLink || !DiscordChannel || !DiscordUser) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(`:x: Usage: \`${prefix}set <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
            })
            //set a Channel
            client.YTP.setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
                .then(ch => {
                    //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                    //send the information
                    message.channel.send({
                        embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`)
                    }).then(msg => msg.react("👍"))
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`${e.message ? e.message : e}`, {
                        code: "js"
                    })
                })
        }
    
        if (message.content === "c!edit" || message.content === "c!change" || message.content === "c!adjust") {
            if (!message.member.hasPermission("Administrator")) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(":x: You are not allowed to execute this Command!")
            })
            let ChannelLink = args[0];
            let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
            let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
            let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
            if (!ChannelLink || !DiscordChannel || !DiscordUser) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(`:x: Usage: \`${prefix}edit <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
            })
            //Edit a Channel
            client.YTP.editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification)
                .then(ch => {
                    //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                    //send information message
                    message.channel.send({
                        embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`I changed the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`)
                    }).then(msg => msg.react("👍"))
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`${e.message ? e.message : e}`, {
                        code: "js"
                    })
                })
        }
    
        if (message.content === "c!remove" || message.content === "c!delete" || message.content == "c!del") {
            if (!message.member.hasPermission("Administrator")) return message.channel.send({
                embed: new Discord.MessageEmbed().setColor("Red").setDescription(":x: You are not allowed to execute this Command!")
            })
            let ChannelLink = args[0];
            if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}del <LINK>`)
            //Delete a Channel
            client.YTP.deleteChannel(message.guild.id, ChannelLink)
                .then(ch => {
                    //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                    //send information message
                    message.channel.send({
                        embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`I deleted the Settings for ${ch.deletedChannel.YTchannel} (<@${ch.deletedChannel.DiscordUser}>), posting in <#${ch.deletedChannel.DiscordChannel}>\n\nThe Message:\n${ch.deletedChannel.message}`)
                    }).then(msg => msg.react("👍"))
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`${e.message ? e.message : e}`, {
                        code: "js"
                    })
                })
        }
    
        if (message.content === "c!get" || message.content === "c!details" || message.content === "c!info") {
            let ChannelLink = args[0];
            if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}get <LINK>\``)
            //get a Channel
            client.YTP.getChannel(message.guild.id, ChannelLink).then(ch => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send the Information Message
                message.channel.send({
                    embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`**Guild:**\n> **\`${client.guilds.cache.get(ch.DiscordGuild).name}\`**` + "\n" +
                        `**Channel to Post:**\n> **${message.guild.channels.cache.get(ch.DiscordChannel)}**` + "\n" +
                        `**Channel Link:**\n> **${ch.YTchannel}**` + "\n" +
                        `**Linked User:**\n> **\`${message.guild.members.cache.get(ch.DiscordUser).user.tag}\`**` + "\n" +
                        `**Last Video:**\n> **\`https://youtube.com/watch=?v${ch.oldvid}\`**` + "\n" +
                        `**Message:**\n>>> \`\`\`${ch.message}\`\`\``)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
        }
    
        if (message.content === "c!getuser" || message.content === "c!userdetails" || message.content === "c!userinfoinfo") {
            let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
            if (!user) user = message.author;
            //get all channels for a User, instead of using a Link
            client.YTP.getChannels4User(message.guild.id, user).then(chs => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send information, you could do a chs.map(ch=>ch.YTchannel)...
                message.channel.send(new Discord.EmbedBuilder().setColor("Green").setDescription(`**__All Links__**\n\`\`\`${chs.map(ch=>ch.YTchannel).join("\n")}\`\`\``)).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
        }
    
        if (message.content === "c!getallchannels") {
            //get all channels
            client.YTP.getAllChannels(message.guild.id)
                .then(chs => {
                    //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                    //send information, you could do a chs.map(ch=>ch.YTchannel)...
                    message.channel.send({
                        embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`There are ${chs.length} Channels Setupped!`)
                    }).then(msg => msg.react("👍"))
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`${e.message ? e.message : e}`, {
                        code: "js"
                    })
                })
        }
    
        if (message.content === "c!deleteallchannels") {
            if (!message.member.hasPermission("Administrator")) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(":x: You are not allowed to execute this Command!")
            })
            //delete all channels method
            client.YTP.deleteAllChannels(message.guild.id)
                .then(data => {
                    //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                    //send a successmessage
                    message.channel.send({
                        embed: new Discord.EmbedBuilder().setColor("Green").setDescription(`I deleted ${data.deletedChannels.length} Channels`)
                    }).then(msg => msg.react("👍"))
                }).catch(e => {
                    console.log(e);
                    message.channel.send(`${e.message ? e.message : e}`, {
                        code: "js"
                    })
                })
        }
    
    
        //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
        if (message.content === "c!channelinfo") {
            let ChannelLink = args[0];
            if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}channelinfo <LINK>\``)
            //get Channel Information
            client.YTP.getChannelInfo(ChannelLink).then(Channel => {
                //console.log(Channel) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //Define the Embed
                let embed = new Discord.EmbedBuilder()
                    .setTitle(Channel.name)
                    .setURL(Channel.url)
                    .setColor("Red")
                    .addFields(
                        {name:"**Subscribercount:**", value:"`" + Channel.subscribers + "`"},
                        {name:"**Tags:**", value:Channel.tags.map(t => `\`${t}\``).join(",  ")},
                        {name:"**Unlisted:**", value:Channel.unlisted ? "✅" : "❌"},
                        {name:"**FamilySafe:**", value:Channel.familySafe ? "✅" : "❌"})
                    .setFooter({text:"ID: " + Channel.id})
                    .setImage(Channel.mobileBanner[0]?.url)
                    .setDescription(String(Channel.description).substr(0, 1500))
                //Send the Message
                message.channel.send({
                    embed: embed
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
        }
    
        //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
        if (message.content === "c!latestvideos" || message.content == ".allvideos") {
            let ChannelLink = args[0];
            if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}latestVideos <LINK>\``)
            //get the Latest Videos
            client.YTP.getLatestVideos(ChannelLink).then(Videos => {
                //console.log(Videos) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //define the Embed
                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Videos of ${Videos[0].author}`)
                    .setColor("Red")
                    .setURL(ChannelLink)
                //For Each Video, add a new Field (just the first 10 Videos!)
                Videos.forEach((v, i) => {
                    if (i < 10) {
                        embed.addFields({name:v.title, value:`[Watch it](${v.link}) | Published at: \`${v.pubDate}\``})
                    }
                })
                //Send the Message
                message.channel.send({
                    embed: embed
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
        }
    
        //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
        if (message.content === "c!lastvideo") {
            let ChannelLink = args[0];
            if (!ChannelLink) return message.channel.send({
                embed: new Discord.EmbedBuilder().setColor("Red").setDescription(`:x: Usage: \`${prefix}lastVideo <LINK>\``)
            })
            //get the latest videos
            client.YTP.getLatestVideos(ChannelLink).then(videos => {
                let video = videos[0]
                let time = new Date(video.pubDate)
                //define the embed
                let embed = new Discord.EmbedBuilder()
                    .setTitle(video.title)
                    .setURL(video.link)
                    .setColor("Red")
                    .setFooter({text:`ID: ${video.id}`})
                    .setTimestamp(time.getTime())
                //Send the Message
                message.channel.send({
                    content: `${video.link}`,
                    embed: embed
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })         
        }
    }
}
