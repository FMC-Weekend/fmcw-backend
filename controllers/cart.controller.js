const CartModel = require('../models/cart_m');
const UserModel = require('../models/User_m');

exports.addElementToCart = async (req, res) => {
    try {
        const {userID, cartItem} = req.body;
        cartItem.payment = {
            status: -1,
            paymentID: "",
            paymentRequestID: ""
        }
        cartItem.Type = cartItem.type;
        delete cartItem.type;
        const cart = await CartModel.findOne({ forUser: userID });
        cart.cartItems.push(cartItem);
        await cart.save();
        res.json({
            status: 'Success'
        })
    }
    catch(err) {
        console.log(err)
        res.json({
            status: 'Failure',
            error: err
        })
    }
}

exports.deleteElementFromCart = async (req, res) => {
    try {
        const {userID, itemId} = req.body;
        const cart = await CartModel.findOne({ forUser : userID });
        let newCartItems = cart.cartItems.filter(item => {
            return item._id != itemId
        });
        cart.cartItems = newCartItems;
        await cart.save();
        res.json({
            status: 'Success'
        })
    }
    catch(err) {
        res.json({
            status: 'Failure',
            error: err
        })
    }
}