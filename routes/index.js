const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webhook', function(req, res, next) {
  fs.readFile('./views/webhook.html' , (err ,html)=>{
    if(err){
      console.error(err);
    } else {
      res.writeHead(200,{'Content-Type' : 'text/html'});
      res.end(html);
    }
  })
});

module.exports = router;
