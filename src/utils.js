const env = process.env

const overrideConfig = config => Object.keys(config)
	.reduce((newConfig, key) => {
		const upperCaseKey = key.toUpperCase()
		newConfig[key] = env[upperCaseKey] || config[key]
		return newConfig
	}, {})

export { overrideConfig }