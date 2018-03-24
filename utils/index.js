const { log } = console

module.exports = {
	log: function logMethod(value) {
		log(value)
	},
	pretty: function prettyMethod(value) {
		log(JSON.stringify(value, undefined, 2))
	}

}
