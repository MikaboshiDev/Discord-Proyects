const serverSchema = require(`../Model/servidor/servidor.js`);
const setupSchema = require(`../Model/servidor/setups.js`);
const ecoSchema = require(`../Model/servidor/economia.js`);
const warnSchema = require(`../Model/warns.js`);
const config = require(`../Sistemas/config.json`);
const chalk = require(`chalk`);
const moment = require("moment")
const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    handlemsg,
    check_if_dj,
    truncar,
    switchTo,
    isValidURL,
    asegurar_todo,
    paginacion
}

function check_if_dj(client, member, song) {
    //if no message added return
    if (!client) return false;
    var roleid = client.settings.get(member.guild.id, `djroles`)
    if (String(roleid) == "") return false;
    var isdj = false;
    for (const djRole of roleid) {
        if (!member.guild.roles.cache.get(djRole)) {
            client.settings.remove(member.guild.id, djRole, `djroles`)
            continue;
        }
        if (member.roles.cache.has(djRole)) isdj = true;
    }
    if (!isdj && !member.permissions.has("Administrator") && song?.requester?.id != member.id)
        return roleid.map(i => `<@&${i}>`).join(", ");
    else
        return false;
}

function handlemsg(txt, options) {
    let text = String(txt);
    for (const option in options) {
        var toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
        text = text.replace(toreplace, options[option]);
    }
    return text;
}

function truncar(texto, n) {
    if (texto.length > n) {
        return texto.substring(0, n) + "..."
    } else {
        return texto;
    }
}

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0:
            status = `Desconectado`
            break;

        case 1:
            status = `Conectado`
            break;

        case 2:
            status = `Conectando`
            break;

        case 3:
            status = `Desconectando`
            break;
    }
    return status;
}

function isValidURL(string) {
    const args = string.split(" ");
    let url;
    for (const arg of args) {
        try {
            url = new URL(arg);
            url = url.protocol === "http:" || url.protocol === "https:";
            break;
        } catch (_) {
            url = false;
        }
    }
    return url;
}

async function asegurar_todo(guildid, userid) {
    if (guildid) {
        let serverdata = await serverSchema.findOne({ guildID: guildid })
        if (!serverdata) {
            console.log(chalk.cyanBright(`[ Configuracion - Funciones ]`) + chalk.whiteBright(`Configuraciones de seguridad y economia realizadas con exito`));
            serverdata = await new serverSchema({
                guildID: guildid,
                prefijo: config.prefix
            });
            await serverdata.save();
        }

        let setupsdata = await setupSchema.findOne({ guildID: guildid })
        if (!setupsdata) {
            console.log(chalk.cyanBright(`[ Setups - Funciones ]`) + chalk.whiteBright(`Setups del bot de discord estan asegurados`));
            setupsdata = await new setupSchema({
                guildID: guildid,
                reaccion_roles: [],
            });
            await setupsdata.save();
        }

        if (userid) {
            let ecodata = await ecoSchema.findOne({ userID: userid })
            if (!ecodata) {
                console.log(chalk.cyanBright(`[ Asegurado - Funciones ]`) + chalk.whiteBright(`Economia de ${userid} esta asegurada con exito`));
                ecodata = await new ecoSchema({
                    userID: userid
                });
                await ecodata.save();
            }
        }

        if (guildid && userid) {
            let warn_data = await warnSchema.findOne({ guildID: guildid, userID: userid })
            if (!warn_data) {
                console.log(chalk.cyanBright(`[ Asegurado - Funciones ]`) + chalk.whiteBright(`Warnings de ${userid} fueron asegurados con exito en el servidor`));
                warn_data = await new warnSchema({
                    guildID: guildid,
                    userID: userid,
                    warnings: [],
                });
                await warn_data.save();
            }
        }
    }
}

async function paginacion(client, message, texto, titulo = "Paginación", elementos_por_pagina = 5) {

    /* DIVIDIMOS EL TEXTO PARA CREAR LAS PAGINAS Y EMPUJARLO EN LOS EMBEDS */

    var embeds = [];
    var dividido = elementos_por_pagina;
    for (let i = 0; i < texto.length; i += dividido) {
        let desc = texto.slice(i, elementos_por_pagina);
        elementos_por_pagina += dividido;
        //creamos un embed por cada pagina de los datos divididos
        let embed = new Discord.EmbedBuilder()
            .setTitle(titulo.toString())
            .setDescription(desc.join(" "))
            .setColor(client.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        embeds.push(embed)
    }

    let paginaActual = 0;
    //Si la cantidad de embeds es solo 1, envíamos el mensaje tal cual sin botones
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
    //Si el numero de embeds es mayor 1, hacemos el resto || definimos los botones.
    let boton_atras = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Atrás').setEmoji('929001012176507040').setLabel('Atrás')
    let boton_inicio = new Discord.ButtonBuilder().setStyle('Danger').setCustomId('Inicio').setEmoji('🏠').setLabel('Inicio')
    let boton_avanzar = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Avanzar').setEmoji('929001012461707335').setLabel('Avanzar')
    //Enviamos el mensaje embed con los botones
    let embedpaginas = await message.channel.send({
        content: `**Haz click en los __Botones__ para cambiar de páginas segun tu interes**`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
        components: [new Discord.ActionRowBuilder().addComponents([boton_atras, boton_inicio, boton_avanzar])]
    });
    //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == message.author.id && i?.message.author.id == client.user.id, time: 180e3 });
    //Escuchamos los eventos del collector
    collector.on("collect", async b => {
        //Si el usuario que hace clic a el botón no es el mismo que ha escrito el comando, le respondemos que solo la persona que ha escrito >>queue puede cambiar de páginas
        if (b?.user.id !== message.author.id) return b?.reply({ content: `<:VS_cancel:1006609599199186974> **Solo la persona que ha escrito \`${prefix}queue\` puede cambiar de páginas!` });

        switch (b?.customId) {
            case "Atrás": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                if (paginaActual !== 0) {
                    //Resetemamos el valor de pagina actual -1
                    paginaActual -= 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = embeds.length - 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            case "Inicio": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                paginaActual = 0;
                await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                await b?.deferUpdate();
            }
                break;

            case "Avanzar": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a avanzar no es la ultima, entonces avanzamos una página
                if (paginaActual < embeds.length - 1) {
                    //Aumentamos el valor de pagina actual +1
                    paginaActual++
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                    //En caso de que sea la ultima, volvemos a la primera
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = 0
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            default:
                break;
        }
    });
    collector.on("end", () => {
        //desactivamos los botones y editamos el mensaje
        embedpaginas.components[0].components.map(boton => boton.disabled = true)
        embedpaginas.edit({ content: `<:VS_cancel:1006609599199186974> El tiempo ha expirado!`, embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
    });
}