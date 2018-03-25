const { log } = console
const { ObjectID } = require('mongodb')

module.exports = {
	newID: function newIDMethod() {
		return new ObjectID()
	},
	idIsValid: function idIsValidMethod(id) {
		return ObjectID.isValid(id)
	},
	log: function logMethod(value) {
		log(value)
	},
	pretty: function prettyMethod(value) {
		log(JSON.stringify(value, undefined, 2))
	}

}
