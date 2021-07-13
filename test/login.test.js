import ava from 'ava'
import { ServiceBroker } from 'moleculer'

import service from '../src/service'
import database from '../src/database'
import token from '../src/token'

const broker = new ServiceBroker()
broker.createService(service)
const user = { username: 'testLoginUser', password: 'testPassword' }

ava.before(async () => {
	await database.init()
	await database.auth.deleteUser(user.username)
	await database.auth.createUser(user.username, user.password)
	await broker.start()
})

ava.after(async () => {
	await database.auth.deleteUser(user.username)
	await broker.stop()
})

ava('should return error if user does not exist', async t => {
	try {
		await broker.call("auth.login", { username: 'wrongUser', password: '12345678' })
		t.fail()
	} catch(error) {
		t.pass()
	}
})

ava('should return error if wrong password', async t => {
	try {
		await broker.call("auth.login", { ...user, password: 'wrongwrong' })
		t.fail()
	} catch(error) {
		t.pass()
	}
})

ava('should return user if right username, password and token', async t => {
	try {
		const res = await broker.call("auth.login", user)
		const payload = token.verify(res.token)
		
		t.is(res.username, user.username)
		t.is(payload.username, user.username)
	} catch(error) {
		t.fail(error)
	}
})

ava('should return user WITHOUT password and salt', async t => {
	try {
		const res = await broker.call("auth.login", user)
		t.falsy(res.password)
		t.falsy(res.salt)
	} catch(error) {
		t.fail(error)
	}
})