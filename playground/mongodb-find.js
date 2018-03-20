const { log, warn } = console
const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost'
const pretty = value => log(JSON.stringify(value, undefined, 2))

MongoClient.connect(uri, function mongoClientConnect(error, client) {
	if (error || !client)
		return warn('Unable to connect to MongoDB server')

	log('Connected to MongoDB server')

	const db = client.db('TodoApp')

	db.collection('Todos').find().count()
		.then((count) => {
			pretty(count)
		})
		.catch((error) => {
			warn(error)
		})

	client.close()
})










