const RegisteredEventsModel = require('../models/registered_events_m');
const UserModel = require('../models/User_m');

exports.addRegisteredEvents= async (req,res) =>{
    var {email,appendToRegisteredEvents}=req.body;
    console.log(req.body);
    console.log(email);
    console.log(appendToRegisteredEvents);
    try {
    const user = await UserModel.findOne({ email: email });
        console.log("user", user)
        const registered_events = await RegisteredEventsModel.findOne({ forUser: user._id });
        console.log(registered_events.registeredEvents)
        registered_events.registeredEvents=registered_events.registeredEvents.concat(appendToRegisteredEvents);
        await registered_events.save()
        res.status(200).json({
            status: 'success'
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            status: 'Failure',
            error: err
        })
    }
}
exports.clearRegisteredEvents= async (req,res)=>{
    console.log(req.body)
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({ email: email });
        console.log("user", user)
        const registered_events = await RegisteredEventsModel.findOne({ forUser: user._id });
        registered_events.registeredEvents=[];
        await registered_events.save();
        res.json({
            status:"Success"
        })
    }catch(arr){
        res.json({
            status:"Failure",
            error:err
        })
    }

}

exports.getRegisteredEvents=async(req,res)=>{
    const {email}=req.body;
    console.log(req.body)
    try{
        const user = await UserModel.findOne({ email: email });
        console.log("user", user)
        const registered_events = await RegisteredEventsModel.findOne({ forUser: user._id });
        console.log(registered_events.registeredEvents)
        res.json({
            status:"Success",
            registeredEvents:registered_events.registeredEvents,
            verified:registered_events.verified
        })
    }catch(err){
        res.json({
            status:"Failure",
            error:err
        })
    }
}
exports.verifyUserPurchase=async(req,res)=>{
    const {email,secureKey}=req.body;
    if(secureKey===process.env.SECURE_VERIFICATION_KEY){
        const user = await UserModel.findOne({ email: email });
        const registered_events = await RegisteredEventsModel.findOne({ forUser: user._id });
        registered_events.verified=true;
        await registered_events.save();
        res.json({
            status:"Success"
        })
    }else{
        res.json({
            status:"Failed"
        })
    }
}
exports.unverifyUserPurchase=async(req,res)=>{
    const {email}=req.body;
    try{
        const user = await UserModel.findOne({ email: email });
        const registered_events = await RegisteredEventsModel.findOne({ forUser: user._id });
        registered_events.verified=false;
        await registered_events.save();
        res.json({
            status:"Success"
        })
    }catch(err){
        res.json({
            status:"Failed",
            error:err
        })
    }
}