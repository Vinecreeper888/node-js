const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('../config');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dish');
const authenticate = require('./authenticate');
const cors = require('./cors');

const url = config.mongoUrl;
const connect = mongoose.connect(url,{useNewParser: true});

connect.then((db) => {
  console.log('Favorite router connect');
}, (err) => {
  console.log(err);
})

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  Favorites.findOne({user: req.user._id})
    .then((favorite) => {
      if(favorite) {
        for(let i = 0;i < req.body.length;i++) {
          if(favorite.dishes.indexOf(req.body[i]._id) === -1) {
            favorite.dishes.push(req.body[i]._id);
          }
        }
        favorite.save()
          .then((favorite) => {
            console.log('Favorite Created',favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite);
          }, (err) => next(err));
      } else {
        Favorites.create({"user":req.user._id, "dishes": req.body})
          .then((favorite) => {
            console.log('Favorite Created', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite);
          }, (err) => next(err));
      }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=> {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
  Favorites.findOneAndRemove({user: req.user._id})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  Favorites.findOne({user: req.user._id})
  .then((favorites) => {
    if(!favorites) {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({"exist": false, "favorites":favorites});
    } else {
      if(favorites.dishes.indexOf(req.params.dishId < 0)) {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({"exist": false, "favorites":favorites});
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({"exist":false, "favorites":favorites});
      }
    }
  }).catch((err) => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Favorites.findOne({user: req.user._id})
    .then((favorite) => {
      if(favorite) {
        if(favorite.dishes.indexOf(req.params.dishId) === -1) {
          favorite.dishes.push(req.params.dishId)
          favorite.save()
            .then((favorite) => {
              console.log('Favorite Created', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type','application/json');
              res.json(favorite);
            }, (err) => next(err))
        }
      } else {
        Favorites.create({"user":req.user._id, "dishes":[req.params.dishId]})
          .then((favorite) => {
            console.log("Favorite Created", favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorite);
          }, (err) => next(err));
      }
    }, (err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
  Favorites.findOneAndRemove({user: req.user._id})
    .then((favorite) => {
      if(favorite) {
        index = favorite.dishes.indexOf(req.params.dishId);
        if(index >= 0) {
          favorite.dishes.splice(index,1);
          favorite.save()
            .then((favorite) => {
              console.log('Favorite Deleted',favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type','application/json');
              res.json(favorite);
            }, (err) => next(err));
        } else {
          //not found
          err = new Error('Dish'+req.params.dishId+' not found!');
          err.status = 404;
          return next(err);
        }
      } else {
        err = new Error('Favorites not found!');
        err.status = 404;
        return next(err);
      }
  }, (err) => next(err));
  .catch((err) => next(err));
});


module.exports = favoriteRouter;
