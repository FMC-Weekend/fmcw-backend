const jwt=require('jsonwebtoken');
const userModel=require('../models/admin_user');
const admin_auth=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser);
        const user=await userModel.findOne({_id:verifyUser._id});
        next();
    }
    catch(error)
    {
        res.status(401).render("error");           
    }
}
module.exports=admin_auth;
