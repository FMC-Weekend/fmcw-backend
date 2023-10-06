
const router = require('express').Router();
var index = require('../controllers/mail.controller.js');
router.post('send-mail',index.sendMail);
router.post("/send", index.send);

module.exports = router;

