const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

const { log } = console
const { stringify, parse } = JSON


const data = {
	id: 10,
}

const token = jwt.sign(data, '123abc')
log(token)

const decoded = jwt.verify(token, '123abc')
log('decoded: ', decoded)

// const message = 'I am user number 3'

// const hash = SHA256(message).toString()

// log(`Message: ${message}`)
// log(`Hash: ${hash}`)

// const data = {
//   id: 4,
// }

// const token = {
//   data,
//   hash: SHA256(stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 2
// // token.hash = SHA256(stringify(token.data)).toString()

// const resultHash = SHA256(stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//   log('Data is valid!')
// } else {
//   log('Data was changed. Don\'t trust it.')
// }
