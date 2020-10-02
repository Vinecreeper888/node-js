const express = require('express');
const bodyParser = require('body-parser');

//this will declare dishRouter as express router
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
  //incoming request
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next(); //will continue on to the next one
})
.get((req,res,next) => {
  res.end('Will send all the dishes to you!');
})
.post((req,res,next) => {
  res.end('Will add the dish: '+req.body.name+' with details '+req.body.description);
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
  res.end('Deleting all the dishes!');
});


dishRouter.route('/:dishId')
.all((req,res,next) => {
  //incoming request
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next();
})
.get((req,res,next) => {
  res.end('Will send dish '+req.params.dishId);
})
.post((req,res,next) => {
  res.end('POST operation not supported on /dishes/');
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.write('Updating the dish: '+req.params.dishId)
  res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next)=> {
  res.end('Deleting the dish: '+req.params.dishId);
});

module.exports = dishRouter;
