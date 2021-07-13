import { ServiceBroker } from 'moleculer'

import { appConfig } from './configs'
import service from './service'
import logger, { loggingOptions } from './logger'

const broker = new ServiceBroker({
	logger: {
		type: "Winston",
		options: {
			level: appConfig.log_level,
			winston: loggingOptions
		}
	},
	requestRetry: 20,
	transporter: `nats://${appConfig.nats_host}:${appConfig.nats_port}`
})

export const startBroker = async () => {
	broker.createService(service)

	try {
		await broker.start()
		logger.info('Running with the following config', { meta: appConfig })
	} catch(error) {
		logger.error(error.message)
	}
}

export default broker
