import logger from './logger'
import { getall } from './actions'
import event from './event'

const brokerLogger = logger.child({ label: "broker" })

const errorHandler = (ctx, err) => {
	brokerLogger.error(`[${ctx.action.name}] ${err.message}`)
	return { error: err.message }
}

const service = {
	name: 'lobby',
	actions: { getall },
	events: {
		"lobby.*"(data) {
			event.emit(data.id, data)
		}
	},
	hooks: {
		error: {
			"*": errorHandler
		}
	}
}

export default service