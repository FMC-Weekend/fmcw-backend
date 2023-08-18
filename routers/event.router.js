var router = require('express').Router();
var index = require('../controllers/event.controller.js');
const isLoggedIn = require('../middleware/auth.js');

router.post('/pay', index.insta);
router.get('/pay/callback/', index.callback);
router.post('/webhook', index.webhook);

// router.post('/payment', index.payment);
// router.post('/checksum', index.checksum);
// router.post('/pay/verification', index.verification);

module.exports = router;