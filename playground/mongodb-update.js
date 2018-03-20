const { log, warn } = console
const { MongoClient, ObjectID } = require('mongodb')

const uri = 'mongodb://localhost'
const pretty = value => log(JSON.stringify(value, undefined, 2))

MongoClient.connect(uri, function mongoClientConnect(error, client) {
	if (error || !client)
		return warn('Unable to connect to MongoDB server')

	log('Connected to MongoDB server')

	const users = client.db('TodoApp').collection('Users')

	users.findOneAndUpdate({
		_id: new ObjectID('5ab07a2aa63add081b5fc101')
	}, {
		$set: { name: 'Marcus' },
		$inc: { age: 1 }
	}, {
		returnOriginal: false,
	})
		.then(pretty)
		.catch(log)

	client.close()
})










