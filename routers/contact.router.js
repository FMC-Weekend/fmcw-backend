const router = require('express').Router();
var contactUs = require('../controllers/contact.us.controller');
router.post('/contact-us',contactUs.contactUs);
module.exports = router;