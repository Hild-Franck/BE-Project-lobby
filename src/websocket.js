import http from 'http'
import WebSocket from 'ws'
import cookie from 'cookie'

import broker from './broker'
import controllers from './controllers'
import logger from './logger'
import event from './event'
import database from './database'

const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })

//TODO: Destroy event listener after connection loss

wss.on('connection', function connection(ws, request) {
	logger.info(`New client connected - ${request.user}`, request.user.username)
	const state = {
		setEvent: id => event.on(id, data => ws.send(JSON.stringify(data)))
	}
	ws.on('message', async function message(msg) {
		try {
			const data = JSON.parse(msg)
			const controller = controllers[data.type]
			if (controller) {
				const result = await controller(data.payload, request.user)
				if (["CREATE_LOBBY", "JOIN_LOBBY"].includes(data.type)) {
					logger.info(`Creating local event lister for ${result.id}`)
					state.setEvent(result.lobby.id)
				}
				if (result) ws.send(JSON.stringify(result))
			}
		} catch (err) {
			console.log(err)
			logger.error(err.message)
			ws.send(JSON.stringify({ error: err.message }))
		}
	})
	ws.on('close', async function () {
		logger.info(`Connection lost by ${request.user.username}`)
		const currentLobby = await database.get(request.user.username)
		if (currentLobby) {
			const players = await database.hincrby(currentLobby, "players", -1)
			if (players === 0) {
				await database.del(currentLobby)
				await database.srem("lobbies", currentLobby)
			}
			await database.del(request.user.username)
		}
	})
})

server.on('upgrade', async function upgrade(request, socket, head) {
	const cookies = cookie.parse(request.headers.cookie || "")
	try {
		const res = await broker.call("auth.authenticate", { token: cookies.authorization })
		request.user = res
		wss.handleUpgrade(request, socket, head, function done(ws) {
			wss.emit('connection', ws, request)
		})
	} catch(err) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
		socket.destroy()
		return
	}
})

server.listen(8081)