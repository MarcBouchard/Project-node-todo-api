const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const { pick, getIdString } = require('../../utils')

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


module.exports = mongoose.model('User', UserSchema)
