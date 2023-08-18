var router = require('express').Router();
var index = require('../controllers/index.controller.js');
const isLoggedIn = require('../middleware/auth.js');

router.get('/admin/alluser', index.alluser);
router.get('/download/pa', index.getdownload);
router.post('/download/pa', index.downloadpa);

// router.get('/verti', index.verti);

module.exports = router;