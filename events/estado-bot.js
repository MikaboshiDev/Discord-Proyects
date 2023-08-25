const moment = require('moment');
const osu = require('node-os-utils');
const os = require('os');
const mongoose = require('mongoose');
const version = require('../../package.json');
const { readdirSync } = require('fs');
const query = require('samp-query');
const { table } = require('console');
require('moment-duration-format');
const chalk = require("chalk");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param { Client } client 
     */
     async execute (client) {
let cpuUsado;
const cpu = osu.cpu
var mem = osu.mem;
let freeRAM, usedRAM;

await mem.info().then(info => {
  freeRAM = info['freeMemMb']
  usedRAM = info['totalMemMb'] - freeRAM
});

let values = {
  high: 200,
  medium: 100,
  low: 50
}
let ping = client.ws.ping
let status;
if(ping > values.high){ status = 'Inestable' }
else if (ping > values.medium){ status = 'Estable' }
else { status = 'Excelente' }

try {
        const stringlength = 69;
        console.log("\n")
        console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.chalk.brightGreen)
        console.log(`     ┃ `.chalk.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".chalk.brightGreen)
        console.log(`     ┃ `.chalk.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".chalk.brightGreen)
        console.log(`     ┃ `.chalk.brightGreen + ` /--/ ${client.user.tag} /--/ `.chalk.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".chalk.brightGreen)
        console.log(`     ┃ `.chalk.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".chalk.brightGreen)
        console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.chalk.brightGreen)
} catch {
console.table({
  "Ram" : `${(usedRAM, freeRAM)} [${Math.round((100 * usedRAM / (usedRAM + freeRAM)))}%]`,
  "Consume Diario" : `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
  "System" : `${os.type} ${os.release} ${os.arch}`,
  "JavaScript" : `${process.version}`,
  "Bot Uptime" : `${moment.duration(client.uptime).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}`,
  "Api Discord Timings" : `${status} | ${ping}ms`,
  "Fecha de Registro" : `${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
  "Servidores Presentes" : `${client.guilds.cache.size} Servidores`,
  "Nucleos" : `${os.cpus().length} Nucleos Activos`,
  "Zona Horaria" : `${moment().format('Z')}`,
  "Sistema Operativo" : `${os.platform} Hosting Ptero`,
  "Version" : `${version.version} Controler`,
  "Node" : `${process.version} Node JS Version`,
  "MongoDB" : `${mongoose.version} Mongoose DB`,
  "Discord.js" : `${version.dependencies['discord.js']} Discord.js`})}
   }
}
