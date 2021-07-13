import { overrideConfig } from '../utils'

const config = {
	name: 'be-project-lobby',
	node_env: 'development',
	version: 'development',
	service: 'lobby',
	port: 8081,
	log_level: 'info',
	nats_host: 'localhost',
	nats_port: 4222

}

const appConfig = overrideConfig(config)

export { appConfig }