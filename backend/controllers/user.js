const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

Logger = 'controller.user.js:'

exports.signup = function(req, res, next) {

  bcrypt.hash(req.body.password,10).then(hash => {
    req.body.password = hash;
    req.body.views = 0;
    const user = new User(req.body);

    user.save()
    .then(result => {
      res.status(201).json({message: 'User created', result: result});
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
  });
  res.status(201).json({message: 'successful add a new user'});
}

exports.getUser = function(req, res, next) {
  username = req.params.username;
  User.find({username: username},(err, userData) => {
    if(err) {
      res.status(500).json({message: 'can not find user by this ID'});
      return;
    }
    delete userData.password;
    res.status(201).json({message:'sucess find the project', user: userData});
  })
}

exports.login = function(req, res, next) {
  username = req.body.username;
  password = req.body.password;
  let fetchedUser;
  User.findOne({ username: username}).then(user => {

    if (!user) {
      return res.status(401).json({
        message: "No username"
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);

  }).then( result => {

    if(!result) {
      return res.status(401).json({
        message: "wrong password"
      })
    }
    const token = jwt.sign(
      {username:fetchedUser.username, userId: fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: "24h"}
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(err => {
    return res.status(401).json({
      message: "Auth failed",
      error: err
    })
  });
}

exports.update = function(req, res, next) {
  if (req.body.username !== req.userData.username) {
    res.status(500).json({message: 'not the same person'});
    return;
  }
  userData = req.body;
  delete userData.password;
  User.updateOne({username: userData.username}, userData, {upsert:true}).then((result) => {
  });
}
