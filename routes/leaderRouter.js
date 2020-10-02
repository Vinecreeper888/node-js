const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next();
})
.get((req,res,next) => {
  res.end('Will get the leader to you!');
})
.post((req,res,next) => {
  res.end('Will send the leader '+req.body.name+' with details '+req.body.description)
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders/');
})
.delete((req,res,next) => {
  res.end('Deleting the leaders!');
});

leaderRouter.route('/:dishId')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next();
})
.get((req,res,next) => {
  res.end('Will get the leader '+req.params.dishId);
})
.post((req,res,next) => {
  res.end('POST operation not supported on /leaders');
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.write('Updating the leader: '+req.params.dishId+'\n');
  res.end('Will update the leader '+req.body.name+' with details '+req.body.description);
})
.delete((req,res,next) => {
  res.end('Deleting the leader: '+req.params.dishId);
});

module.exports = leaderRouter;
