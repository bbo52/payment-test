const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');

/* GET home page. */


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

router.post('/getToken', function(req, res, next) {
  const [err, getToken] = axios({
    url: 'https://api.iamport.kr/users/getToken',
    method: 'post', // POST method
    headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
    data: {
      imp_key: "7495396678046189", // REST API키
      imp_secret: "2f6bXTQKnQgLNWpyMpYrANlROHHGLoPODVZBPQmcGCYuzn2lN1NoP8fEPWkBlapZ6oBWeX9Vz7p8vsuj"
    },
  });
});

module.exports = router;
