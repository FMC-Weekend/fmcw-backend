const e = require('express');
const { getGoogleUserInfo } = require('../middleware/goath');
const pamodel = require('../models/pa_m');
const usermodel = require('../models/User_m');
const instimodel = require('../models/ins_m');
const camodel = require('../models/ca_m');
const { genrefcodepa, genorderid, genrefcodeca } = require('../services/generaterefcode');
var exports = module.exports = {}
const Insta = require('instamojo-nodejs');
const url = require('url');

exports.insta = async function(req, res){
  var user = {};
  console.log(req.body.type);
  user.pass = req.body.type;
  user.add = req.body.add;
  var discount = 1;
  var id;
  await getGoogleUserInfo(req.body.token)
  .then((result) => {
    user.email = result;
  //   req.session.email = result;
  })
  .catch((error) => {
    console.log(error);
  });

  await pamodel.findOne({where:{email: user.email}})
  .then((foundItem)=>{
      id = foundItem.id;
      if(Number(foundItem.codecheck) === 1)discount = 0.9;
  }).catch((error)=>{
    console.log(error);
  });

  console.log(discount);
  if(user.pass === "aep"){
      user.amount = 399*discount;
  }
  else if(user.pass === "sep"){
      user.amount = 149*discount;
  }
  else if(user.pass === "dep"){
      user.amount = 199*discount;
  }
  else if(user.pass === "awp"){
    user.amount = 349*discount;
};

  user.receipt = 'ORD' + await genorderid();
  console.log(user.receipt);
  user.amount = user.amount*100;
  await pamodel.update(user, {where : {email: user.email}})
  .then((result)=>{
      console.log("User updated");
  })
  .catch((error)=>{
      console.log(error);
  });

  user.amount = user.amount/100;
  // Insta.setKeys('test_bf512c3a40c2f59272d5c7b4128', 'test_c3f26ee714594dfbb320fe30e3c');
  Insta.setKeys('abcdbe5b7f0bf1f574530cc4c5a060e6', '2bda9b8bc6c85604f5b8ff410746ba11');

	const data = new Insta.PaymentData();
	// Insta.isSandboxMode(false);

	data.purpose =  user.pass;
	data.amount = user.amount;
	data.buyer_name =  user.name;
	data.redirect_url =  'https://fmcweek-liart.vercel.app/pay/callback?foo='+id;
	data.email =  user.email;
	data.phone =  user.number;
	data.send_email =  true;
	data.webhook= 'https://fmcweek-liart.vercel.app/webhook';
	data.send_sms= false;
	data.allow_repeated_payments =  false;
  // console.log(data);

  const finalurl = (obj)=>{
    return new Promise((resolve, reject)=>{
      Insta.createPayment(obj, function(error, response) {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          // Payment redirection link at response.payment_request.longurl
          const responseData = JSON.parse( response );
          console.log(responseData);
          const redirectUrl = responseData.payment_request.longurl;
          console.log( redirectUrl );
          return resolve(redirectUrl);
    }
  });
    });
  };

  finalurl(data).then((result)=>{
    console.log(result);
    res.json({url: result});
  }).catch((error)=>{
    console.log(error);
  });

};

exports.callback = function(req, res){

  var responseData = req.query;
  console.log(responseData);
    // let url_parts = new URL('http://localhost:8080' + req.url),
    //   responseData = url_parts.query;
    // console.log(JSON.parse(url_parts.searchParams));
    // if ( responseData.payment_id ) {
      // let userId = responseData.user_id;
  
      // // Save the info that user has purchased the bid.
      // const bidData = {};
      // bidData.package = 'Bid100';
      // bidData.bidCountInPack = '10';
  
      // User.findOneAndUpdate( { _id: userId }, { $set: bidData }, { new: true } )
      //   .then( ( user ) => res.json( user ) )
      //   .catch( ( errors ) => res.json( errors ) );
  
      // Redirect the user to payment complete page.

      Insta.getPaymentDetails(responseData.payment_request_id, responseData.payment_id, function(error, response) {
        if (error) {
          // Some error
          console.log(error);
        } else {
          console.log(response);
          if(responseData.payment_status === 'Credit'){
            pamodel.update({paid: "Credit", payment_request_id: responseData.payment_request_id, payment_id: responseData.payment_id}, {where: {id: responseData.foo}});
            console.log("payment success");
            
            var html = '<html><body><center><h2>Thank You for your participation in FMC Weekend! <br> Contact us for any queries. Redirecting you to the Home Page!!</h2></center><script type="text/javascript">setTimeout(function() {window.location = "https://fmcweekend.in/#/dash";}, 7000)</script></body></html>'
            res.writeHead(200,{'Content-Type' : 'text/html'});
            res.write(html);
            res.end();
          }
          else {
            console.log("Payment Failed!!");
            var html = '<html><body><center><h2>Your FMC Weekend pass payment has been failed, please contact support or retry payment. Redirecting you to the Home Page!!</h2></center><script type="text/javascript">setTimeout(function() {window.location = "https://fmcweekend.in";}, 7000)</script></body></html>'
            res.writeHead(200,{'Content-Type' : 'text/html'});
            res.write(html);
            res.end();
          };
        }
      });
    // }
};

exports.webhook = async function(req, res){
  console.log(req.body);
  ref_code = await genrefcodepa();
  console.log(ref_code);

  if(req.body.status === "Credit"){
    await pamodel.findOne({where: {email: req.body.buyer}})
    .then((result)=>{
      if(result.redeem && result.redeem.substring(0,2)==="CA"){
        camodel.findOne({where: {ref_code : result.redeem}}).then((found)=>{
          camodel.update({norefcode: Number(found.norefcode)+1}, {where : {ref_code: found.ref_code}})
        });
      }

      else if(result.redeem && result.redeem.substring(0,2)==="IN"){
        instimodel.findOne({where: {ref_code : result.redeem}}).then((found)=>{
          instimodel.update({norefcode: Number(found.norefcode)+1}, {where : {ref_code: found.ref_code}})
        });
      }

    else if(result.redeem && result.redeem.substring(0,2)==="PA"){
        pamodel.findOne({where: {ref_code : result.redeem}})
        .then((found)=>{
            pamodel.update({norefcode: Number(found.norefcode)+1}, {where : {ref_code: found.ref_code}})
        });
    };
    });

    await pamodel.update({ref_code: ref_code}, {where:{email: req.body.buyer}})
    .then((result)=>{
      console.log("refcode generated");
      res.send("payment success");
    }).catch((error)=>{
      console.log(error);
    });  
  }
  else {
    res.send("Payment Failed");
  };  
  };

exports.payment = async function(req, res){
    var user = {};
    user = req.body;
    var discount = 1;

    await getGoogleUserInfo(req.session.token)
    .then((result) => {
      user.email = result;
    //   req.session.email = result;
    })
    .catch((error) => {
      res.send(error);
    });

    await pamodel.findOne({where:{email: user.email}})
    .then((foundItem)=>{
        if(foundItem.checkcode === 1)discount = 0.9;
    }).catch((error)=>{
        res.send(error);
    });

    if(user.pass === "allevent"){
        user.amount = 450*discount;
    };
    
    if(user.pass === "single"){
        user.amount = 150*discount;
    };

    if(user.pass === "double"){
        user.amount = 250*discount;
    };

    user.receipt = 'ORD' + genorderid();
    await pamodel.update(user, {where : {email: user.email}})
    .then((result)=>{
        console.log("User updated");
    })
    .catch((error)=>{
        res.send(error);
    });

    let params ={};
  params['MID'] = 'WrVtoC97652565042711',//test
  // params['MID'] = 'WlxzSl31434530714153',//prod

  // params['WEBSITE'] = 'DEFAULT', //prod
  params['WEBSITE'] = 'WEBSTAGING'
  params['CHANNEL_ID'] = 'WEB',
  params['INDUSTRY_TYPE_ID'] = 'Retail',
  params['ORDER_ID'] = 'ORD' + user.receipt,
  params['CUST_ID'] = 'CUST' + user.receipt,
  params['TXN_AMOUNT'] = user.amount,
  params['CALLBACK_URL'] = 'https://fmcw.vercel.app/checksum',
  params['EMAIL'] = user.email,
  params['MOBILE_NO'] = user.phone


  // checksum_lib.genchecksum(params,'rC5kwuvMUs_4h@TL',function(err,checksum){
    checksum_lib.genchecksum(params,'lWUs#lux2l2JDySM',function(err,checksum){
    let txn_url = "https://securegw-stage.paytm.in/order/process"
    // let txn_url = "https://securegw.paytm.in/order/process"

    let form_fields = ""
    for(x in params)
    {
        form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

    }

    form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' />"

    var html = '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields +'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
    res.writeHead(200,{'Content-Type' : 'text/html'});
    res.write(html);
    res.end();
});
}

exports.checksum = function(req, res){
    console.log('Token is ' + req.session.token);
    paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;
  
    var isVerifySignature = checksum_lib.verifychecksum(req.body, 'lWUs#lux2l2JDySM' , paytmChecksum);
    // var isVerifySignature = checksum_lib.verifychecksum(req.body, 'rC5kwuvMUs_4h@TL' , paytmChecksum);
  if (isVerifySignature) {
    console.log("Checksum Matched");
    res.redirect('/pay/verification');
  } else {
      console.log("Checksum Mismatched");
  }
};
  
exports.verification = async function(req, res){
    console.log('Token is ' + req.session.token);
         // Send Server-to-Server request to verify Order Status
         var emailverify;
        //  await getGoogleUserInfo(sess)
        await getGoogleUserInfo(req.session.token)
         .then((result) => {
           emailverify = result;
           req.session.email = result;
         })
         .catch((error) => {
           res.send(error);
         });
  
         console.log(emailverify);
  
         var orderid = "ORD";
         await usermodel
         .findOne({
           where: {
             email: emailverify,
           },
         })
         .then((foundItem) => {
            if(!foundItem) {res.send({"error": "No transaction found"});};
            orderid = orderid + foundItem.receipt;
            // console.log(foundItem);
         });
  
         console.log(orderid);
  
         var params = {"MID": "WrVtoC97652565042711", "ORDERID": orderid};
        // var params = {"MID": "WlxzSl31434530714153", "ORDERID": orderid};
  
        //  checksum_lib.genchecksum(params, 'rC5kwuvMUs_4h@TL', function (err, checksum) {
          checksum_lib.genchecksum(params, 'lWUs#lux2l2JDySM', function (err, checksum) {
    
           params.CHECKSUMHASH = checksum;
           var post_data = 'JsonData='+JSON.stringify(params);
    
           var options = {
             hostname: 'securegw-stage.paytm.in', // for staging
            //  hostname: 'securegw.paytm.in', // for production
             port: 443,
             path: '/merchant-status/getTxnStatus',
             method: 'POST',
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Length': post_data.length
             }
           };
    
    
           // Set up the request
           var response = "";
           var post_req = https.request(options, function(post_res) {
             post_res.on('data', function (chunk) {
               response += chunk;
             });
    
             post_res.on('end', async function(){
               console.log('S2S Response: ', response, "\n");
    
               var _result = JSON.parse(response);
                 if(_result.STATUS == 'TXN_SUCCESS') {
                 
                  
                    var code = genrefcodepa();
                    var part = {};
                    part.refcode = code;
                    
                    part.paid = _result.STATUS;
                    console.log(part);
                  await usermodel.update(part, {
                    where: {
                      email: emailverify
                    }
                  }).then(async (result)=>{
                      console.log('updated');
                  }).catch((error)=>{
                    console.log(error);
                  })
                  
                    // ('payment sucess');
                    console.log("Payment Success!!");
                    
                    // res.redirect('/mailsend');
                     
                 }else {
                     res.send('Payment Failed!')
                 }
               });
           });
    
           // post the data
           post_req.write(post_data);
           post_req.end();
          });
        };
  
