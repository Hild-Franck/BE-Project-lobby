import jwt from 'jsonwebtoken'

const secret = process.env.SECRET

const token = {
	create: payload => jwt.sign(payload, secret),
	verify: token => jwt.verify(token, secret)
}

export default token