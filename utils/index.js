const { log } = console
const { ObjectID } = require('mongodb')

module.exports = {
	newID: function newIDMethod() {
		return new ObjectID()
	},
	log: function logMethod(value) {
		log(value)
	},
	pretty: function prettyMethod(value) {
		log(JSON.stringify(value, undefined, 2))
	}

}
