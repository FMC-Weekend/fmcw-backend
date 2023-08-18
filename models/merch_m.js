const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const merchSchema = new Schema({
    title : {
        type: String, 
        required: true
    },
    description : {
        type: String, 
        required: true
    },
    color: {
        type: String,
        enum: {
            values : ['black', 'white'],
            message: 'Merchandise available only in 2 colors'
        }
    },
    size: {
        type: String,
        enum: {
            values: ['xs', 's', 'm', 'l', 'xl']
        }
    },
    merchType: String,
    price: {
        type: 'Number',
        required: true
    },
    availability: {
        type: 'Number'
    }
})

const merchModel = mongoose.model('merch', merchSchema);
module.exports = merchModel;