const { ObjectID } = require('mongodb')

const { mongoose } = require('../server/db/mongoose')
const Todo = require('../server/models/todo')
const User = require('../server/models/user')
const { pretty, log } = require('../utils')


// const id = '15ab6e270da1b891f3e4ddc02'

// Todo.find({ _id: id })
//   .then((todos) => {
//     log('Todos: ', todos)
//   })

// Todo.findOne({ _id: id })
//   .then((todo) => {
//     log('Todo: ', todo)
//   })

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo)
//       return log('Id not found')

//     log('Todo By Id: ', todo)
//   })
//   .catch((error) => {
//     log(error)
//   })

User.findById('5ab69ac1114e3de248d7bfc1')
	.then((user) => {
		if (!user)
			return log('Unable to find user')
		
		pretty(user)

	})
