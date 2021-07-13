import { overrideConfig } from '../utils'

const config = {
	database: 'pikachu',
	postgres_user: 'pikachu',
	postgres_password: 'jesus',
	options: {
		dialect: "postgres",
		host: "postgres",
		port: "5432"
	}
}

const dbConfig = overrideConfig(config)

dbConfig.options.host = process.env.POSTGRES_HOST || dbConfig.options.host

export { dbConfig }