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
	.get(authenticate, getTodosCB)
	.post(authenticate, postTodosCB)

app.route('/todos/:id')
	.get(authenticate, getTodosIdCB)
	.delete(authenticate, deleteTodosIdCB)
	.patch(authenticate, patchTodosIdCB)

app.post('/users', postUsersRouteCB)

app.listen(port, function appListenCB() {
	log(`Started up at port ${port}`)
})

app.get('/users/me', authenticate, getUsersMeCB)

app.post('/users/login', postUsersLoginCB)

app.delete('/users/me/token', authenticate, deleteUsersMeTokenCB)

module.exports = app



// *******************************************************************
//-- ROUTE HANDLERS --------------------------------------------------
//---------------------------------------------------------- /todos --
async function getTodosCB(req, res) {
	try {
		const todos = await Todo.find({ _creator: req.user._id })
		res.send({ todos })
	} catch (error) {
		res.status(400).send(error)
	}

}

async function postTodosCB(req, res) {
	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id,
	})

	try {
		const doc = await todo.save()
		res.send(doc)
	} catch (error) {
		res.status(400).send(error)
	}
}


//------------------------------------------------------ /todos/:id --
async function getTodosIdCB(req, res) {
	const { id } = req.params

	if (!idIsValid(id))
		return res.status(400).send('User Id not valid.')

	try {
		const todo = await Todo.findOne({
			_id: id,
			_creator: req.user._id,
		})

		if (!todo)
			return res.status(404).send()

		res.send({ todo })
	} catch (error) {
		res.status(400).send()
	}

}

async function patchTodosIdCB(req, res) {
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

	try {
		const todo = await Todo.findOneAndUpdate(
			{ _id: id, _creator: req.user._id},
			{ $set: body }, { new: true },
		)

		if (!todo)
			return res.status(404).send()

		res.send({ todo })
	} catch (error) {
		res.status(400).send()
	}

}

async function deleteTodosIdCB(req, res) {
	const { id } = req.params

	if (!idIsValid(id))
		return res.status(400).send()

	try {
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id,
		})

		if (!todo)
			return res.status(404).send()

		res.send({ todo })
	} catch (error) {
		res.status(400).send()
	}
}

//-- /USERS/LOGIN ----------------------------------------------------
async function postUsersLoginCB(req, res) {
	try {
		const body = pickEmailPassword(req.body)
		const user = await User.findByCredentials(body.email, body.password)
		const token = await user.generateAuthToken()
		res.header('x-auth', token).send(user)
	} catch (error) {
		res.status(400).send()
	}

}


//-- /USERS ----------------------------------------------------------
async function postUsersRouteCB(req, res) {
	try {
		const body = pickEmailPassword(req.body)
		const user = new User(body)

		await user.save()
		const token = await user.generateAuthToken()
		res.header('x-auth', token).send(user)

	} catch (error) {
		res.status(400).send()
	}

}


//------------------------------------------------------- /users/me --
function getUsersMeCB(req, res) {
		res.send(req.user)
}


//------------------------------------------------- /users/me/token --
async function deleteUsersMeTokenCB(req, res) {
	try {
		await req.user.removeToken(req.token)
		res.status(200).send()
	} catch (error) {
		res.satus(400).send()
	}
}
