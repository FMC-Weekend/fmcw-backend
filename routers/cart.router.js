const router = require('express').Router();
const { addElementToCart, deleteElementFromCart, getCartItems, clearCart,updatePaymentStatus,pendingPayment,successPayment } = require('../controllers/cart.controller');
router.route('/cart').post(addElementToCart).delete(deleteElementFromCart).get(getCartItems);
router.route('/carts').post(getCartItems).delete(clearCart);
router.route('/payment').patch(updatePaymentStatus);
router.route('/pending').post(pendingPayment);
router.route('/success').post(successPayment);

module.exports = router;
