import http from 'http'

import logger from '../logger'
import { sequelize } from '../database'

const reqLogger = logger.child({ label: 'http-request' })

const headers = {
	"Content-Type": "application/json; charset=utf-8"
}

const state = {
	data: { up: false, timestamp: Date.now(), err: null },
	updateState: async () => {
		try {
			await sequelize.authenticate()
			state.data.up = true
			state.data.err = null
		} catch(e) {
			state.data.up = false
			state.data.err = "Unable to connect to database"
		}
		state.data.timestamp = Date.now()
	}
}

const requestHandler = async (req, res) => {
	if(req.url == '/health') {
		await state.updateState()
		res.writeHead(state.data.up ? 200 : 500, headers)
		res.end(JSON.stringify(state.data, null, 2))
	} else {
		res.writeHead(404, http.STATUS_CODES[404], {})
		res.end()
	}
	reqLogger.debug(`${res.statusCode} ${req.method} ${req.url}`)
}

const server = http.createServer(requestHandler)

export default {
	created: () => server.listen(3000),
	started: () => state.data.up = true,
	stopping: () => state.data.up = false,
	stopped: () => state.data.up = false && server.close()
}