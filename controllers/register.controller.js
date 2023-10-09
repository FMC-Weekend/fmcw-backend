const e = require('express');
const { getGoogleUserInfo } = require('../middleware/goath');
const pamodel = require('../models/pa_m');
const usermodel = require('../models/User_m');
const instimodel = require('../models/ins_m');
const camodel = require('../models/ca_m');
const { genrefcodeca, genrefcodepa } = require('../services/generaterefcode');
const slackInteraction=require("./slack.controller.js")
var exports = module.exports = {}

exports.registerca = async function(req, res){

    try {

        var token = req.body.token;
        var ca = {};
        ca.name = req.body.name;
        ca.number = req.body.number;
        ca.organization = req.body.organization;
        ca.year = req.body.year;
        await getGoogleUserInfo(token).then((result)=>{
            ca.email = result;
        });
    
        ca.ref_code = await genrefcodeca();
        console.log(ca.ref_code);
    
        usermodel.update({email: ca.email},{role : 2})
        .exec((err, result)=>{
            if(err) console.log(err);
            console.log("user updated");
        });
    
        camodel.create(ca).then((result)=>{
            console.log(result);
            res.json({"message": "success"});
        }).catch((error)=>{
            res.send({"message": "login failed"});
        });
    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
};

exports.registerpa = async function(req, res){
    try {

        var token = req.body.token;
        var pa = {};
        
        pa.name = req.body.name;
        pa.number = req.body.number;
        pa.organization = req.body.organization;
        pa.year = req.body.year;
        pa.redeem = req.body.redeem;
        pa.codecheck = 0;
        
        await getGoogleUserInfo(token).then((result)=>{
            pa.email = result;
        }).catch((err)=>{
            console.log(err);
            res.send({'message': 'invalid user'});
        });
    
        await usermodel.update({email: pa.email}, {role : 1})
        .exec((err, result)=>{
            if(err) console.log(err);
            
            console.log("user updated");
        });
    
        if(pa.redeem && pa.redeem.substring(0,2)==="CA"){
            console.log('ca');
            await camodel.findOne({ref_code : pa.redeem})
            .exec(async (err, foundItem)=>{
                if(err) res.send(err);
    
                if(!foundItem){
                    res.json({"message": "InvalidCode"});
                }
                pa.codecheck = 1;
                console.log(pa.codecheck);
                var norefcode = foundItem.norefcode;
                console.log(norefcode);
            })
        }
    
        else if(pa.redeem && pa.redeem.substring(0,2)==="IN"){
            console.log('in');
            await instimodel.findOne({ref_code : pa.redeem})
            .exec(async (err, foundItem)=>{
                if(err)  res.send(err);
    
                if(!foundItem){
                res.json({"message": "InvalidCode"});
                }
                pa.codecheck = 1;
                console.log(pa.codecheck);
                var norefcode = foundItem.norefcode;
                console.log(norefcode);
            })
        }
    
        else if(pa.redeem && pa.redeem.substring(0,2)==="PA"){
            console.log('pa');
            await pamodel.findOne({ref_code : pa.redeem})
            .exec(async (err, foundItem)=>{
                if(err)  res.send(error);
    
                if(!foundItem){
                res.json({"message": "InvalidCode"});
                }
                pa.codecheck = 1;
                console.log(pa.codecheck);
                var norefcode = foundItem.norefcode;
                console.log(norefcode);
            })
        };
    
        await pamodel.create(pa).exec((err, result)=>{
            if(err) res.send({"message": "failed"});
    
            console.log(result);
            res.json({"message": "success"});
        });
    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
};


exports.details = async function(req, res){

    try {

        var token = req.body.token;
        var dashuser = {};
        var role;
        
        await getGoogleUserInfo(token).then((result)=>{
            console.log(result);
            if(result === "notoken"){
                res.json({"message": message});
            };
            dashuser.email = result;
        }).catch((error)=>{
            console.log(error);
            res.json({"message": "no token"});
        });
    
        await usermodel.findOne({email: dashuser.email})
        .exec((error, result)=>{
            if(error){
                console.log(error);
                res.send(error);
            }
            role = result.role;
            dashuser.role = role;
        });
    
        if(role === 1){
        await pamodel.findOne({email: dashuser.email})
            .exec((err, result)=>{
                if(err) console.log(err);
    
                if(result){
                    if(result.paid === "Credit"){
                        dashuser.pass = result.pass;
                        dashuser.add = result.add;
                    }
                else {
                    dashuser.pass = '';
                    dashuser.add = '';
                }
                    dashuser.ref_code = result.ref_code;
                    dashuser.norefcode = result.norefcode;
                    dashuser.name = result.name;
                    dashuser.number = result.number;
                    dashuser.organization = result.organization;
                    dashuser.year = result.year;
                    res.json(dashuser);
                };
            });
        } 
        else if(role === 2){
        await camodel.findOne({email: dashuser.email})
            .then((err, result)=>{
                if(err) console.error(err);
    
                if(result){
                dashuser.ref_code = result.ref_code;
                dashuser.norefcode = result.norefcode;
                dashuser.name = result.name;
                dashuser.number = result.number;
                dashuser.organization = result.organization;
                dashuser.year = result.year;
                res.json(dashuser);
                };
            });
        }
        else if(role === 0){
        await instimodel.findOne({email: dashuser.email})
            .then((err, result)=>{
                if(err) console.error(err);
    
                if(result){
                dashuser.ref_code = result.ref_code;
                dashuser.norefcode = result.norefcode;
                dashuser.name = result.name;
                res.json(dashuser);
                };
            });
        }
    }
    catch(error) {
        res.json({
            status: 'Fail',
            error
        })
    }
};