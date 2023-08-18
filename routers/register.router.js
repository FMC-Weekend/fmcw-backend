var router = require('express').Router();
var index = require('../controllers/register.controller.js');
// var passport = require('passport');
// const isLoggedIn = require('../middleware/auth.js');
var gauth = require('../middleware/goath.js')

router.post('/registerca', index.registerca);
router.post('/registerpa', index.registerpa);
router.post('/dashboard/details', index.details);
// router.post('/registerca', index.registerca);


module.exports = router;