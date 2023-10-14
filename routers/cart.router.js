const router = require('express').Router();
const { addElementToCart, deleteElementFromCart, getCartItems } = require('../controllers/cart.controller');
router.route('/cart').post(addElementToCart).delete(deleteElementFromCart).get(getCartItems);
router.route('/carts').post(getCartItems);
module.exports = router;
