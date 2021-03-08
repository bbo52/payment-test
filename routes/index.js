const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

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

router.post('/getToken', async function(req, res, next) {

/*  res.json({test:'test'});
  return res;*/
  try{
    const [err, getToken] = axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
      data: {
        imp_key: "7495396678046189", // REST API키
        imp_secret: "2f6bXTQKnQgLNWpyMpYrANlROHHGLoPODVZBPQmcGCYuzn2lN1NoP8fEPWkBlapZ6oBWeX9Vz7p8vsuj"
      },
    }).then( (response) =>{
      console.log(response);
      res.json({result : response.data.response.access_token});
      return res;
    }).catch( (err) =>{
      return err
    })
  } catch(err){
    return err;
  }
});

/** 생성된 빌링키를 이용해 결재 */

router.post('/again', async function(req, res, next){

    const { customer_uid , accessToken } = req.body;
    let paymentResult;
    [err, paymentResult] = axios({
      url:'http://api.iamport.kr/subscribe/payments/again',
      method: 'post',
      headers:{'Authorization': accessToken},
      data:{
        customer_uid,
        merchant_uid:'merchant_'+ new Date().getTime(),
        amount:10,
        name: 'Handsome seokyeon Test'
      }
    }).then( (response) =>{
      //console.log(response);
      res.json( response.data.response);
      return res;
    }).catch( (err) =>{
      return err;
    })

});



/** 결제 예약*/

router.post('/schedule', async function(req, res, next){
  const { imp_uid, merchant_uid } = req.body;

  let getToken; let err;
  [err, getToken] = await to(axios({
    url:'https://api.iamport.kr/users/getToken',
    method:'post',
    headers:{'Content-Type': 'application/json'},
    data:{
      imp_key: CONFIG.imp_apiKey,
      imp_secret: CONFIG.imp_secretKey,
    },
  }));
  if(err) return ReE(res, err);

  const { access_token } = getToken.data.response;

  let getPaymentData;
  [err, getPaymentData] = await to(axios({
    url:'https://api.iamport.kr/payments/' + imp_uid,
    method:'get',
    headers:{'Authorization': access_token},
  }));
  if(err) return ReE(res, err);

  const paymentData = getPaymentData.data.response;

  const {status} = paymentData;
  const {schedule_at} = req.body;
  if(status === 'paid'){
    const merchant_uid = 'merchant_'+ new Date().getTime();
    axios({
      url:'https://api.iamport.kr/subscribe/payments/schedule',
      method:'post',
      headers:{'Authorization': access_token},
      data: {
        customer_uid:"donghyun_0304",
        schedules:[{
          merchant_uid:merchant_uid,
          schedule_at: moment(schedule_at, "M/D/YYYY H:mm").unix(),
          //schedule_at:시간설정,
          amount: 10,
          name:'정기예약걸제',
          buyer_name:'강동현',
          buyer_tel:'01074128466',
          buyer_email:'ddhyunk@gmail.com',
          schedule_status:'scheduled',
          payment_status:'paid',
        }]
      }
    });
    const result = paymentData.data;
    return ReS(res, result);
  } else{
    return ReE(err.message);
  }
})

/** 예약 결제 취소 */

router.post('/scheduleCancel', async function(req, res, next){
  try{
    const { imp_uid, merchant_uid } = req.body;

    let getToken; let err;
    [err, getToken] = await to(axios({
      url:'https://api.iamport.kr/users/getToken',
      method:'post',
      headers:{'Content-Type': 'application/json'},
      data:{
        imp_key:CONFIG.imp_apiKey,
        imp_secret: CONFIG.imp_secretKey,
      },
    }));
    if(err) return ReE(res, err);

    const { access_token } = getToken.data.response;

    let getPaymentData;
    [err, getPaymentData] = await to(axios({
      url:'https://api.iamport.kr/payments/'+ imp_uid,
      method:'get',
      headers:{'Authorization': access_token},
    }));
    if(err) return ReE(res, err);

    const paymentData = getPaymentData.data.response;
    const { status } = paymentData;
    if(status === 'paid'){
      axios({
        url:'https://api.iamport.kr/subscribe/payments/unschedule',
        method:'post',
        headers:{'Authorization':access_token},
        data: {
          customer_uid: '',
          merchant_uid,
          name: 'test0305'
        }
      });
      const result = paymentData.data;
      return ReS(res, result);
    } else{
      return ReE(res, err.message);
    }
  }catch(error){
    res.status(400).send(error);
  }
});

/** 예약 결제 조회 */

router.get('/search', async function(req, res, next){
  const { merchant_uid } = req.body;

  let getToken; let err;
  [err, getToken] = await to(axios({
    url:'https://api.iamport.kr/users/getToken',
    method:'post',
    headers:{'Content-Type': 'application/json'},
    data:{
      imp_key: CONFIG.imp_apiKey,
      imp_secret: CONFIG.imp_secretKey,
    },
  }));
  if(err) return ReE(res, err);

  const { access_token } = getToken.data.respond;

  let getPaymentData;

  [err, getPaymentData] = await to(axios({
    url:'https://api.iamport.kr/subscribe/payments/schedule/'+ merchant_uid,
    method:'get',
    headers:{'Authorization': access_token},
  }));
  if(err) return ReE(res, err);

  const paymentData = getPaymentData.data.response;

  const {schedule_status} = paymentData;
  if(schedule_status === 'scheduled'){
    const result = paymentData;
    return ReS(res, paymentData);
  } else {
    return res.status(404).send(err);
  }
});
module.exports = router;
