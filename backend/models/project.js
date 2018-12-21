const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title: { type: String, required: true  },
  parts: { type: String, required: true  },
  description: { type: String, required: true },
  coverImgUrl: { type: String, required: true },
  createDate: {type: String, required: true},
  //creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
  creatorId: { type: String, required: true, ref: "User"},
  keyWords: { type:[{type: String }]},
  size: {type: Number}
});

module.exports  = mongoose.model('Project', projectSchema);
