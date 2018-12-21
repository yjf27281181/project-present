const Project = require('../models/project')
const User = require('../models/user')
const fs = require('fs');

Logger = 'controller.project.js:'
exports.uploadProject = function(req, res, next) {
  const project = new Project(req.body);
  project['createDate'] = (new Date()).toLocaleString();
  project['creatorId'] = req.userData.userId;
  project.save().then(result => {
    res.status(201).json({
      message: 'project added Successfully',
      projectId: result._id
    });
  }).catch(error => {
    res.status(500).json({message: 'Creating a project Failed', error: error});
  });
}

exports.updateProject = function(req, res, next) {
  const project = new Project(req.body);

  if (req.body.creatorId !== req.userData.userId) {
    res.status(500).json({message: 'do not have permission to change the content'});
    return;
  }

  Project.updateOne({_id: project._id}, project).then(result => {
    res.status(201).json({message: "updating successfully"});
  }).catch(error => {
    res.status(500).json({message: 'Updating a project Failed', error: error});
  });
}

exports.getProject = function(req, res, next) {
  projectId = req.params.id;
  Project.findById(projectId, (err, result) => {
    if(err) {
      res.status(500).json({message: 'can not find project by this ID'});
      return;
    }
    res.status(201).json({message:'sucess find the project', project: result});
  })
}

exports.uploadImage = function(req, res, next) {
  const url = req.protocol + '://' + req.get("host");

  res.status(200).json({index: req.body.index, url: url + '/images/' + req.file.filename});

}

exports.getProjectsInfo = function(req, res, next) {
  username = req.params.username;
  update = { $inc: { views: 1 }};
  console.log(username);
  User.updateOne({username: username},update).exec((err, res)=> {
    console.log(err);
  });
  User.findOne({username: username}, '_id').then(user => {
    Project.find({creatorId: user._id},  '_id description title coverImgUrl createDate creatorId')
    .then((result) => {
      res.status(200).json({projectsInfo: result});
    })
  })
}



exports.deleteImages = function(req, res, next) {
  urls = req.body;
  for(var i=0; i<urls.length; i++) {
    url = urls[i];
    deleteImage(url);
  }
  res.status(201).json({messsage: 'successful deleted'})
}

function deleteImage(url) {
  filename = url.split("/").pop();
  fs.unlink('images/'+filename, (err) => {
      return err;
  });
}

exports.deleteProject = function(req, res, next) {

  projectId = req.params.projectId;
  console.log('delete project controller');
  console.log(projectId);
  Project.findById(projectId, (err, result) => {
    if(err || !result) {
      res.status(500).json({message: 'can not find project by this ID'});
      return;
    }
    if (result.creatorId !== req.userData.userId) {
      res.status(500).json({message: 'do not have permission to change the content'});
      return;
    }
    deleteImage(result.coverImgUrl);

    parts = JSON.parse(result.parts);
    for(var i=0; i<parts.length; i++) {
      if(parts[i].type === 'image') {
        deleteImage(parts[i].url);
      }
    }
    Project.deleteOne({_id: projectId}).then((result) => {
      res.status(201).json({message: 'successful delete'});
    })
  })
}
