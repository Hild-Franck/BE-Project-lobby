import redis from 'redis'
import { promisify } from 'util'

import logger from './logger'

const client = redis.createClient({ host: 'localhost' })

client.on("error", err => logger.error(err.message))

export default {
	get: promisify(client.get).bind(client),
	set: promisify(client.set).bind(client),
	del: promisify(client.del).bind(client),
	hmset: promisify(client.hmset).bind(client),
	hmget: promisify(client.hmget).bind(client),
	hincrby: promisify(client.hincrby).bind(client),
	hgetall: promisify(client.hgetall).bind(client),
	sadd: promisify(client.sadd).bind(client),
	srem: promisify(client.srem).bind(client),
	smembers: promisify(client.smembers).bind(client)
}