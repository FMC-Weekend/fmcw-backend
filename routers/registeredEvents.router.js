const router = require('express').Router();
const {addRegisteredEvents,clearRegisteredEvents,getRegisteredEvents,verifyUserPurchase,unverifyUserPurchase,verifiedEvents,addVerifiedEvents}=require('../controllers/registeredEvents.controller');
router.route('/events').post(getRegisteredEvents).delete(clearRegisteredEvents);
router.route('/events/add').post(addRegisteredEvents);
router.route('/events/verify').post(verifyUserPurchase);
router.route('/events/unverify').post(unverifyUserPurchase);
router.route('/events/verified').post(verifiedEvents);
router.route('/events/addVerified').post(addVerifiedEvents);
module.exports = router;