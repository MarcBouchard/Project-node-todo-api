const mongoose = require('mongoose')
const { Schema } = mongoose


const UserSchema = new Schema({
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	completedAt: {
		type: Number,
		default: null,
	},
})


module.exports = mongoose.model('Todo', UserSchema)


