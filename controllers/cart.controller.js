const CartModel = require('../models/cart_m');
const UserModel = require('../models/User_m');

exports.addElementToCart = async (req, res) => {
    //  console.log(req.body)
    var { userID, cartItem } = req.body;



    try {

        cartItem.payment = {
            status: -1,
            paymentID: "",
            paymentRequestID: ""
        }
        cartItem.desc = cartItem.description;
        cartItem.title = cartItem.Title;
        delete cartItem.Title;
        delete cartItem.description;
        cartItem.Type = cartItem.type;
        delete cartItem.type;
        // console.log("userId", userID)
        const cart = await CartModel.findOne({ forUser: userID });
        // console.log("cart", cart);
        // console.log("frontend Carts", cartItem);
        cart.cartItems.push(cartItem);
        await cart.save();
        res.status(200).json({
            status: 'success'
        })
    }
    catch (err) {
        console.log(err)
        res.json({
            status: 'Failure',
            error: err
        })
    }
}

exports.deleteElementFromCart = async (req, res) => {
    console.log(req.body)
    try {
        const { userID, itemId } = req.body;
        const cart = await CartModel.findOne({ forUser: userID });
        // console.log(cart)
        // cart.cartItems.map(item=>{
        //     // console.log(item.id)
        //     if(item.id == itemId){
        //         console.log("item found")
        //     }
        //     else{

        //     }

        // })
        let newCartItems = cart.cartItems.filter(item => {
            return item.id != itemId
        });
        cart.cartItems = newCartItems;
        await cart.save();
        res.json({
            status: 'Success'
        })
    }
    catch (err) {
        res.json({
            status: 'Failure',
            error: err
        })
    }
}