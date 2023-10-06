const router = require('express').Router();
var index = require('../controllers/mail.controller.js');
router.post('send-mail',index.sendMail);
module.exports = router;