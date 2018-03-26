const jwt = require('jsonwebtoken')

const Todo = require('../../models/todo')
const User = require('../../models/user')
const { newID } = require('../../../utils')

const userOneId = newID()
const userTwoId = newID()

const users = [
	{
		_id: userOneId,
		email: 'user1@example.com',
		password: 'userOnePassword',
		tokens: [{
			access: 'auth',
			token: jwt.sign(
				{ _id: userOneId, access: 'auth' },
				'abc123',
			).toString()
		}]
	},
	{
		_id: userTwoId,
		email: 'user2@example.com',
		password: 'userTwoPassword',
		tokens: [{
			access: 'auth',
			token: jwt.sign(
				{ _id: userTwoId, access: 'auth' },
				'abc123',
			).toString()
		}]
	},
]

const todos = [
	{
		_id: newID(),
		text: 'First test todo',
		_creator: userOneId,
	},{
		_id: newID(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333,
		_creator: userTwoId,
	}
] 

function populateTodos(done) {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos)
		})
		.then(() => done())
}	

function populateUsers(done) {
	User.remove({})
		.then(() => {
			const userOne = new User(users[0]).save()
			const userTwo = new User(users[1]).save()

			return Promise.all([userOne, userTwo])
		})
		.then(() => done())

}

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers,
}
