const router = require('express').Router();
const { addElementToCart, deleteElementFromCart, getCartItems, clearCart } = require('../controllers/cart.controller');
router.route('/cart').post(addElementToCart).delete(deleteElementFromCart).get(getCartItems);
router.route('/carts').post(getCartItems).delete(clearCart);
module.exports = router;
