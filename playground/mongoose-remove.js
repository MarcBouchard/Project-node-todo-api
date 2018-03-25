const { ObjectID } = require('mongodb')

const { mongoose } = require('../server/db/mongoose')
const Todo = require('../server/models/todo')
const User = require('../server/models/user')
const { pretty, log } = require('../utils')



// Todo.remove({})
//   .then((result) => {
//     log(result)
//   })

// Todo.findOneAndRemove({ text: 'Find one and remove'  })
//   .then((doc) => {
//     log(doc)
//   })


// Todo.findByIdAndRemove('5ab715a2f72a59d664e84ce2')
//   .then((doc) => {
//     log(doc)
//   })
