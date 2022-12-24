const express=require('express');;
const router=express.Router();
// const visitor=require('../controllers/visitors');
// router.post('/visitor',visitor);
const visitor=require('../models/visitors');
const mongoose=require('mongoose');
router.post('/visitor',async (req,res)=>{
try{
var visitorId=req.body.visitorId;
// var visitorId=mongoose.Types.ObjectId();
var newVisitor=new visitor({
    visitorId:visitorId
})
await newVisitor.save();
res.json({
    message:"success",
    visitorId:visitorId
})
}catch(err){
console.log(err);
}
});
module.exports=router;
