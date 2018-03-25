const mongoose = require('mongoose')
const { pick, getIdString } = require('../../utils')

const { Schema } = mongoose

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
	},
})


module.exports = mongoose.model('User', UserSchema)
