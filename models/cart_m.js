const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    forUser: String,
    cartItems: [{
        id: String,
        img: String,
        genre: String,
        Type: String,
        title: String,
        link: String,
        price: Number,
        prize: String,
        color: String,
        color2: String,
        content: String,
        time: String,
        date: String,
        desc: String,
        name: String,
        img1: String,
        img2: String,
        price1: Number,
        price2: Number,
        payment: {
            status: {
                type: Number,
                enum: [-1,0,1,2],
                default: -1,
            },
            paymentID: {
                type: String,
                default: '',
            },
            paymentRequestID: {
                type: String,
                default: '',
            }
        },
        verifyStatus: {
            type: Boolean,
            default: false
        },
        transactionID: {
            type: String,
            default: null
        }
    }]
})

const CartModel = mongoose.model('cart', CartSchema);
module.exports = CartModel;