const mongoose=require('mongoose');
const visitorSchema=mongoose.Schema({
    visitorId:{
        type:String,
        required:true
    }
    
})
const visitor=mongoose.model('visitor',visitorSchema);
module.exports=visitor;
