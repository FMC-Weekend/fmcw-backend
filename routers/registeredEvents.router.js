const router = require('express').Router();
const {addRegisteredEvents,clearRegisteredEvents,getRegisteredEvents,verifyUserPurchase,unverifyUserPurchase}=require('../controllers/registeredEvents.controller');
router.route('/events').post(getRegisteredEvents).delete(clearRegisteredEvents);
router.route('/events/add').post(addRegisteredEvents);
router.route('/events/verify').post(verifyUserPurchase);
router.route('/events/unverify').post(unverifyUserPurchase);
module.exports = router;