const router = require('express').Router();
const url = require('url');
const Insta = require('instamojo-nodejs');

const userModel = require('../models/User_m');

router.post('/pay', (req, res) => {
    try {
        const { amount, name, redirect_url, email, phone } = req.body;
        console.log(process.env.PRIVATE_AUTH_TOKEN);
        Insta.setKeys(process.env.PAYMENT_API_KEY, process.env.PRIVATE_AUTH_TOKEN);
        let data = new Insta.PaymentData();
        Insta.isSandboxMode(true);
        data.purpose = 'fmcweekend';
        data.amount = amount;
        data.buyer_name = name;
        data.redirect_url = redirect_url;
        data.email = email;
        data.phone = phone;
        data.send_email = false;
        // data.webhook = 'http://www.example.com/webhook',
        data.send_sms = true,
        data.allow_repeated_payments = true
    
        Insta.createPayment(data, function(error, response) {
            if(error) {
                console.log(error);
                res.status(400).json({
                    status: 'Failure'
                })
            }
            else {
                var resData = JSON.parse(response);
                console.log(resData);
                // const redirectUrl = resData.payment_request.longurl;
                res.status(200).json({
                    status: 'Success'
                    // redirectUrl
                })
            }
        })

    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
})

router.get('/pay/callback', async (req, res) => {
    try {
        let url_parts = url.parse(req.url, true);
        let resData = url_parts.query;
    
        let user = await userModel.findById(resData.user_id);
        if(resData.payment_id) {
            let cartItems = user.cartItems.map(item => {
                if(item.payment && item.payment.status > -1) return item;
                else {
                    return {
                        ...item,
                        payment: {
                            status: 1,
                            paymentID: resData.payment_id,
                            paymentRequestID: resData.payment_request_id
                        }
                    }
                }
            })
            user.cartItems = cartItems;
        }
        else {
            let cartItems = user.cartItems.map(item => {
                if(item.payment && item.payment.status > -1) return item;
                else {
                    return {
                        ...item,
                        payment: {
                            status: 0,
                            paymentID: null,
                            paymentRequestID: null
                        }
                    }
                }
            })
            user.cartItems = cartItems;
        }
        
        await user.save();
    
        const updatedUser = await userModel.findById(user._id);
        res.status(200).json({
            updatedUser
        })

    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
})

module.exports = router;