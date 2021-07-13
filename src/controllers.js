import { v4 as uuidv4 } from 'uuid'

import database from './database'
import broker from './broker'
import logger from './logger'

const controllers = {
	CREATE_LOBBY: async (data, user) => {
		const id = uuidv4()
		const lobby = {
			id, owner: user.username, private: !!data.private, type: data.type,
			state: "PENDING", maxPlayers: data.maxPlayers || 2, players: 1
		}
		await database.hmset(id,
			"id", id,
			"owner", user.username,
			"private", !!data.private,
			"type", data.type,
			"roundDuration", data.roundDuration || 10,
			"maxPlayers", data.maxPlayers || 10,
			"numberOfRounds", data.numberOfRounds || 10,
			"players", 1,
			"full", false,
			"state", "PENDING"
		)
		if (!data.private)
			await database.sadd("lobbies", id)
		await database.sadd(`players:${id}`, user.username)
		await database.set(user.username, id)
		logger.info(`Creating lobby ${id} !`)
		return { lobby, type: "LOBBY_CREATED" }
	},
	JOIN_LOBBY: async (data, user) => {
		const lobby = await database.hgetall(data.lobby)
		await database.sadd(`players:${data.lobby}`, user.username)
		await database.hmset(data.lobby, "players", ++lobby.players)
		await database.set(user.username, data.lobby)
		const players = await database.smembers(`players:${data.lobby}`)
		logger.info(`${user.username} joined lobby ${data.lobby} !`)
		broker.broadcast(`lobby.join`, {
			type: 'PLAYER_JOINED', username: user.username, id: data.lobby
		})
		return { lobby, players, type: "LOBBY_JOINED" }
	},
	START_GAME: async (data, user) => {
		await broker.call("game.start", {
			lobby: data.lobby, username: user.username
		})
		return { success: true, type: "GAME_STARTING" }
	},
	ANSWER_GAME: async (data, user) => {
		const res = await broker.call("game.answer", {
			lobby: data.lobby, level: data.level,
			answer: data.answer, username: user.username
		})
		broker.broadcast(`lobby.answer`, {
			type: 'PLAYER_ANSWERED', ...res, id: data.lobby
		})
	}
}

export default controllers