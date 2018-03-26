const expect = require('expect')
const request = require('supertest')

const app = require('../server')
const Todo = require('../models/todo')
const User = require('../models/user')
const { newID } = require('../../utils')
const {
	todos,
	populateTodos,
	users,
	populateUsers,
} = require('./seed')

const userOne = users[0]
const userTwo = users[1]

beforeEach(populateUsers)
beforeEach(populateTodos)


describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		const text = 'Test todo text'

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text)
			})
			.end((err, res) => {
				if (err)
					return done(err)

				Todo.find({ text })
					.then((todos) => {
						expect(todos.length).toBe(1)
						expect(todos[0].text).toBe(text)
						done()
					})
					.catch(error => done(error))

			})
	})

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((error, res) => {
				if (error)
					return done(error)	

				Todo.find()
					.then((todos) => {
						expect(todos.length).toBe(2)
						done()
					})
					.catch(error => done(error))
			})
	})
})

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2)
			})
			.end(done)
	})
})

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text)
			})
			.end(done)
	})

	it('should return 404 if todo not found', (done) => {
		const hexId = newID().toHexString()

		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done)
	})

	it('should return 400 for non-object ids', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(400)
			.end(done)

	})
})

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		const hexId = todos[1]._id.toHexString()

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId)
			})
			.end((error, res) => {
				if (error)
					return done(error)

				Todo.findById(hexId)
					.then((todo) => {
						expect(todo).toBeNull()
						done()
					})
					.catch(error => done(error))
			})
	})

	it('should return 404 if todo not found', (done) => {
		const hexId = newID().toHexString()

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done)

	})

	it('should return 404 if object id is invalid', (done) => {
		const hexId = newID().toHexString()

		request(app)
			.delete('/todos/123')
			.expect(400)
			.end(done)

	})
})

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		const hexId = todos[0]._id.toHexString()	
		const text = 'This should be the new text'

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text,
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text)
				expect(res.body.todo.completed).toBe(true)
				expect(Number.isInteger(res.body.todo.completedAt)).toBe(true)
			})
			.end(done)
	})

	it('should clear completedAt when todo is not completed', (done) => {
		const hexId = todos[1]._id.toHexString()	
		const text = 'This should be the new text!!'

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: false,
				text,
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text)
				expect(res.body.todo.completed).toBe(false)
				expect(res.body.todo.completedAt).toBeNull()
			})
			.end(done)

	})
})

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', userOne.tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(userOne._id.toHexString())
				expect(res.body.email).toBe(userOne.email)
			})
			.end(done)
	})

	it('should return a 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toMatchObject({})
			})
			.end(done)
	})
})

describe('POST /users', () => {
	it('should create a user', (done) => {
		const email = 'example@example.com'
		const password = '123mnb!'

		request(app)
			.post('/users')
			.send({ email, password })
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy()
				expect(res.body._id).toBeTruthy()
				expect(res.body.email).toBe(email)
			})
			.end((error) => {
				if (error)
					return done(error)

				User.findOne({ email })
					.then((user) => {
						expect(user).toBeDefined()
						expect(user.password).not.toBe(password)
						done()
					})
			})
			
	})

	it('should return validation errors if request invalid', (done) => {
		request(app)
			.post('/users')
			.send({
				email: 'invalid@invalid.com',
				password: '123',
			})
			.expect(400)
			.end(done)

	})

	it('should not create user if email in use', (done) => {
		request(app)
			.post('/users')
			.send({
				email: userOne.email,
				password: userOne.password,
			})
			.expect(400)
			.end(done)

	})
})

