//UserModel Schema
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
name:{
 type:String,
 required:[true,'name is required'],
 },
username:{
 type:String,
 required:[true,'email is required'],
 unique:true
},
password:{
 type:String,
required:[true, 'password is required']
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]
});
userSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
        // console.log(token);
    }catch(error)
    {
        console.log(error);
    }
}


const userModel=mongoose.model('Adminss',userSchema);
module.exports=userModel;
