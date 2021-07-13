import database from '../database'

const getall = {
	params: {},
	handler: async () => {
		const lobbiesIds = await database.smembers("lobbies")
		const lobbies = await Promise.all(lobbiesIds.map(id => database.hgetall(id)))

		return lobbies
	}
}

export { getall }