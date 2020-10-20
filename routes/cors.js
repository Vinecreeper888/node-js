const express = require('express');
const cors = require('cors');
const app = express();

//contains all the origins
const whitelist = ['http://localhost:3000','https://localhost:3443'];
const corsOptionsDelegate = (req,callback) => {
  var corsOptions;

  if(whitelist.indexOf(req.header('Origin')) !== -1) {
    //returns the index if its present
    corsOptions = {origin: true};
  } else {
    //not in the whitelist
    corsOptions = {origin:false}
  }
  callback(null,corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
