require('./config')
const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const Todo = require('./models/todo')
const User = require('./models/user')
const authenticate = require('./middleware/authenticate')
const {
	pretty,
	log,
	pick,
	pickEmailPassword,
	isBoolean,
	idIsValid,
} = require('../utils')


const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.route('/todos')
	.post(function postTodosCB(req, res) {
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
	.get(function getTodosCB(req, res) {
		Todo.find()
			.then((todos) => {
				res.send({ todos })
			})
			.catch((error) => {
				res.status(400).send(error)
			})
	})

app.route('/todos/:id')
	.get(function getTodosIdCB(req, res) {
		const { id } = req.params

		if (!idIsValid(id))
			return res.status(400).send('User Id not valid.')

		Todo.findById(id)
			.then((todo) => {
				if (!todo)
					return res.status(404).send()

				res.send({ todo })
			})
			.catch((error) => {
				res.status(400).send()
			})
	})
	.delete(function deleteTodosIdCB(req, res) {
		const { id } = req.params

		if (!idIsValid(id))
			return res.status(400).send()

		Todo.findByIdAndRemove(id)
			.then((todo) => {
				if (!todo)
					return res.status(404).send()

				res.send({ todo })
			})
			.catch(() => {
				res.status(400).send()
			})
	})
	.patch(function patchTodosIdCB(req, res) {
		const { id } = req.params

		const body = pick(req.body, ['text', 'completed'])

		if (!idIsValid(id))
			return res.status(400).send()

		if (isBoolean(body.completed) && body.completed) {
			body.completedAt = new Date().getTime()
		} else {
			body.completed = false
			body.completedAt = null
		}

		Todo.findByIdAndUpdate(id, { $set: body }, { new: true })	
			.then((todo) => {
				if (!todo)
					return res.status(404).send()

				res.send({ todo })
			})
			.catch((error) => {
				res.status(400).send()
			})
	})

app.route('/users')
	.post(function postUsersRouteCB(req, res) {
		const body = pickEmailPassword(req.body)
		const user = new User(body)

		user.save()
			.then(() => {
				return user.generateAuthToken()
			})
			.then((token) => {
				res.header('x-auth', token).send(user)
			})
			.catch((error) => {
				res.status(400).send()
			})
	})
app.listen(port, function appListenCB() {
	log(`Started up at port ${port}`)
})

app.route('/users/me')
	.get(authenticate, function getUsersMeCB(req, res) {
		res.send(req.user)
	})

app.post('/users/login', function getUsersLoginCB(req, res) {
	const body = pickEmailPassword(req.body)

	User.findByCredentials(body.email, body.password)
		.then((user) => {
			return user.generateAuthToken()
				.then((user) => {
					res.header('x-auth', token).send(user)
				})
		})
		.catch((error) => {
			res.status(400).send()
		})

})



module.exports = app
