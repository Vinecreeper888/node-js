const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
const storage = multer.diskStorage({
  //further configuration
  destination: (req,file,cb) => {
    cb(null, 'public/images');
  },
  filename: (req,file,cb) => {
    //gives the original from the client side
    cb(null,file.originalname)
  }
});

const imageFileFilter = (req,file,cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'),false);
  }
  cb(null,true); //file matches the regex
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus = 200;})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('GET operation not supported on /imageUpload ');
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'), (req,res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json(req.file); //to know the location
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /imageUpload');
})

module.exports = uploadRouter;
