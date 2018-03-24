const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const Todo = require('./models/todo')
const User = require('./models/user')
const { pretty, log } = require('../utils')

const app = express()

app.use(bodyParser.json())

app.post('/todos', function postTodosCB(req, res) {
	const todo = new Todo({
		text: req.body.text,
	})

	todo.save()
		.then((doc) => {
			res.send(doc)
		})
		.catch((error) => {
			res.status(400).send(error)
		})
})


app.listen(3000, function appListenCB() {
	console.log('Server is listening on port 3000')
})

module.exports = app
