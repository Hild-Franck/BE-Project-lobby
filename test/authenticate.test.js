import ava from 'ava'
import { ServiceBroker } from 'moleculer'

import service from '../src/service'
import database from '../src/database'
import token from '../src/token'

const broker = new ServiceBroker()
broker.createService(service)
const user = { username: 'testLoginUser2', password: 'testPassword2' }

let createdUser = null

ava.before(async () => {
	await database.init()
	await database.auth.deleteUser(user.username)
	createdUser = await database.auth.createUser(user.username, user.password)
	await broker.start()

})

ava.after(async () => {
	await database.auth.deleteUser(user.username)
	await broker.stop()
})

ava('should return error if wrong token', async t => {
	try {
		await broker.call("auth.authenticate", { token: 'testToken' })
		t.fail()
	} catch(error) {
		t.pass()
	}
})

ava('should return user if right token', async t => {
	try {
		const res = await broker.call("auth.authenticate", {
			token: token.create({ username: createdUser.username, id: createdUser.id })
		})

		t.is(res.username, user.username)
	} catch(error) {
		t.fail(error)
	}
})