const { log, warn } = console
const { MongoClient, ObjectID } = require('mongodb')

const obj = new ObjectID()
log(obj)

const uri = 'mongodb://localhost'
const pretty = value => log(JSON.stringify(value, undefined, 2))

MongoClient.connect(uri, function mongoClientConnect(error, client) {
	if (error || !client)
		return warn('Unable to connect to MongoDB server')

		
	log('Connected to MongoDB server')

	const db = client.db('TodoApp')

//   db.collection('Users').insertOne({
//     name: 'Marc',
//     age: 20,
//     location: 'Here',
//   }, (err, result) => {
//     if (error)
//       return warn('Unable to insert user.', error)

//     pretty(result.ops[0]._id.getTimestamp())
//   })



	client.close()
})










