const bcrypt = require('bcryptjs');

bcrypt.hash("",10).then(hash => {
  console.log(hash)
})
