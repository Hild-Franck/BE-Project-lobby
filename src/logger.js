import winston from 'winston'

import { appConfig } from './configs'

const {
	combine, timestamp, prettyPrint, printf, align, colorize, json
} = winston.format

const customLevels = {
	levels: { crit: 0, error: 1, warn: 2, info: 3, debug: 4 },
	colors: {crit:'red', error:'red', warn:'yellow', info:'white', debug:'grey'}
}

const logLevel = process.env.LOG_LEVEL
	|| process.env.NODE_ENV == 'development' && 'debug'
	|| 'info'

const timeFormat = 'DD-MM-YYYY HH:mm:ss'

const format = process.env.NODE_ENV === 'production'
	? combine(timestamp({ format: timeFormat }), json())
	: combine(
		winston.format(info => {
			info.level = info.level.toUpperCase()
			return info
		})(),
		align(),
		timestamp({ format: timeFormat }),
		colorize(),
		printf(({ level, message, label, timestamp, meta }) => {
			const labelDisplay = label ? `[${label}]` : ""
			const infoDisplay = `[${timestamp}][${level}]${labelDisplay}`
			const metaDisplay = meta ? `\n${JSON.stringify(meta, null, 2)}` : ''
			return `${appConfig.name}.${appConfig.version} ${infoDisplay} ${message}${metaDisplay}`
		}),
	)

export const loggingOptions = {
	levels: customLevels.levels,
	level: logLevel,
	transports: [new winston.transports.Console({ format })],
	format: combine(
		timestamp(),
		prettyPrint()
	)
}

const logger = winston.createLogger(loggingOptions)

winston.addColors(customLevels.colors)

logger.stream = {
	write: message => logger.info(message, { label: 'express' })
}

export default logger