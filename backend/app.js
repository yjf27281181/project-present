express = require('express');
app = express();
const mongoose = require('mongoose');
const path = require('path')

const bodyParser = require('body-parser');
const projectsRouter = require('./routers/project');
const usersRouter = require('./routers/user');

const Logger = 'app.js:';



mongoose.connect('mongodb://yjf:'+ 'yjf199572' +'@cluster0-shard-00-00-nmlpq.mongodb.net:27017,cluster0-shard-00-01-nmlpq.mongodb.net:27017,cluster0-shard-00-02-nmlpq.mongodb.net:27017/node-angular?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true')
.then(() =>{
  console.log(Logger + 'Connected to databse');
})
.catch(()=>{
  console.log(Logger + ' An error occur');
});

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, content-type, Accept, authorization");
  res.setHeader('Access-Control-Allow-Methods',"GET, POST, PUT,PATCH, DELETE, OPTIONS");
  next();
});

//app.use("/images", express.static(path.join("images")));
app.use("/images", express.static("images"));
app.use("/api/project", projectsRouter);
app.use("/api/user", usersRouter);

module.exports = app;
