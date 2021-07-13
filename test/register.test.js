import ava from 'ava'
import { ServiceBroker } from 'moleculer'

import service from '../src/service'
import database from '../src/database'

const broker = new ServiceBroker()
broker.createService(service)
const user = { username: 'testUser', password: 'testPassword' }
const userTwo = { username: 'testUser2', password: 'testPassword' }
const createdUser = { username: 'testCreatedUser', password: 'testPassword' }

ava.before(async () => {
	await database.init()
	await database.auth.deleteUser(user.username)
	await database.auth.deleteUser(userTwo.username)
	await database.auth.deleteUser(createdUser.username)
	await database.auth.createUser(createdUser.username, createdUser.password)
	await broker.start()
})

ava.after(async () => {
	await broker.stop()
})

ava('should return error if wrong params', async t => {
	try {
		await broker.call("auth.register", { username: '', password: '42424242' })
		t.fail()
	} catch(error) {
		t.pass()
	}
})

ava('should return user with correct params', async t => {
	try {
		const res = await broker.call("auth.register", user)
		console.log(res)
		t.is(res.username, user.username)
	} catch(error) {
		t.fail()
	}
})

ava('should not return user password or salt', async t => {
	try {
		const res = await broker.call("auth.register", userTwo)
		t.falsy(res.password)
		t.falsy(res.salt)
	} catch(error) {
		t.fail(error)
	}
})

ava('should return error if already user exist', async t => {
	try {
		await broker.call("auth.register", createdUser)
		t.fail()
	} catch(error) {
		t.pass()
	}
})