const { log, warn } = console
const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost'
const pretty = value => log(JSON.stringify(value, undefined, 2))

MongoClient.connect(uri, function mongoClientConnect(error, client) {
	if (error || !client)
		return warn('Unable to connect to MongoDB server')

	log('Connected to MongoDB server')

	const todos = client.db('TodoApp').collection('Todos')

	/* deleteMany - delete all documents in the collection that
	 * match query and returns an obj where obj.result shows the
	 * status of the delete operation.
	 */
//   todos.deleteMany({ text: 'Eat lunch' })
//     .then(result => log(result.result))
//     .catch((error) => {
//       warn(error)
//     })


	/* deleteOne - deletes the first occurence that matches the
	 * query and returns an obj where obj.result shows the
	 * status of the delete operation.
	 */
//   todos.deleteOne({ text: 'Eat lunch' })
//     .then(result => log(result.result))
//     .catch((error) => {
//       warn(error)
//     })


	/* findOneAndDelete - deletes the first occurence that matches
	 * the query and returns an object containing status as well as
	 * the deleted document on the value field. 
	 */
	todos.findOneAndDelete({ completed: true })
		.then(pretty)
		.catch((error) => {
			warn(error)
		})

	client.close()
})










