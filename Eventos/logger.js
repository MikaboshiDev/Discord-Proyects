const { createLogger, format, transports } = require('winston');
const rn = new Date();
const date = `Vermiel-Creadora-${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
module.exports = {
    name: "ready",
    execute(client) {
	client.logger = createLogger({
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			format.printf(log => `[${log.timestamp.split('T')[1].split('.')[0]} ${log.level}]: ${log.message}`),
		),
		transports: [
			new transports.Console(),
			new transports.File({ filename: `Logs/${date}.log` }),
		],
		rejectionHandlers: [
			new transports.Console(),
			new transports.File({ filename: `Logs/${date}.log` }),
		],
		exceptionHandlers: [
			new transports.Console(),
			new transports.File({ filename: `Logs/${date}.log` }),
		],
	});
	client.logger.info('Iniciando y Conectando a la DB');
	client.on('disconectado', () => client.logger.info('Bot is desconectado...'));
	client.on('reconectando', () => client.logger.info('Bot reconectado exitosamente...'));
	client.on('warn', error => client.logger.warn(error));
	client.on('error', error => client.logger.error(error));
   }
};
