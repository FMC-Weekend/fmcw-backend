const router = require('express').Router();

const { addElementToCart, deleteElementFromCart } = require('../controllers/cart.controller');

router.route('/cart').post(addElementToCart).delete(deleteElementFromCart);

module.exports = router;
