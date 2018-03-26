const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const { pick, pickEmailPassword, getIdString } = require('../../utils')

const { Schema } = mongoose

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	tokens: [{
		access: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	}]
})

// Instance Methods
UserSchema.methods.toJSON = function toJsonCB() {
	const user = this
	const userObject = user.toObject()

	return pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function generateAuthTokenCB() {
	const user = this
	const access = 'auth'

	const token = jwt.sign(
		{ _id: getIdString(user) },
		'abc123',
	).toString()

	user.tokens.push({ access, token })

	return user.save()
		.then(() => {
			return token
		})
}

// Model Methods
UserSchema.statics.findByToken = function findByTokenStatics(token) {
	const user = this
	let decoded

	try {
		decoded = jwt.verify(token, 'abc123')
	} catch (error) {
		return Promise.reject()
	}

	return mongoose.model('User').findOne({
			_id: decoded._id,
			'tokens.token': token,
			'tokens.access': 'auth',
		})
}

// Model Hooks
UserSchema.pre('save', function savePre(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})


module.exports = mongoose.model('User', UserSchema)
