const bcrypt = require('bcryptjs')

const password = '123abc'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

const hashedPassword = '$2a$10$J9i6aKDfL6u81ylpst8h3e4UkBkKn0S7kRCNQqFde9rR7bhDTAOgK'

bcrypt.compare(password + 1, hashedPassword, (err, res) => {
	console.log(res)
})
