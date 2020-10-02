const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
  //incoming request
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next();
})
.get((req,res,next) => {
  res.end('Will send the promo to you!')
})
.post((req,res,next) => {
  res.end('Will add the promo: '+req.body.name+' with details '+req.body.description);
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promo');
})
.delete((req,res,next) => {
  res.end('Deleting all the promos');
});


promoRouter.route('/:dishId')
.all((req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','/text/plain');
  next();
})
.get((req,res,next) => {
  res.end('Will send the promo: '+req.params.dishId);
})
.post((req,res,next) => {
  res.end('POST operation not supported on /promos/');
})
.put((req,res,next) => {
  res.statusCode = 403;
  res.write('Updating the promotion: '+req.params.dishId+'\n');
  res.end('Will update the promotion: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next) => {
  res.end('Deleting the promo: '+req.params.dishId);
});

module.exports = promoRouter;
