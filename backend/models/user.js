const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique : true},
  password: { type: String, required: true  },

  firstName: { type: String},
  lastName: {type: String},
  currentSchool: {type: String},
  currentMajor: {type: String},
  selfIntroduction: {type: String},
  phoneNumber: {type: String},
  email: {type: String},
  skills: { type:[{type: String }]},
  location: {type: String},
  views: {type: Number}
});

module.exports  = mongoose.model('User', userSchema);
