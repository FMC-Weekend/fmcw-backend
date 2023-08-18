const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    merchID : {
        type: mongoose.Schema.ObjectId, 
        ref: 'merch',
        required: true
    },
    orderedBy : {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    paymentID : {
        type: String, 
        required: true
    },
    orderedOn: Date,
    deliveryAddress: {
        type: String, 
        required: true
    },
    quantity: {
        type: Number, 
        required: true, 
        default: 1
    }
})

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;