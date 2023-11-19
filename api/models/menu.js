const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    type: {
        type:[{
            type: String,
            enum: ['Burgers', 'Pizza', 'Canadian', 'Veggi']
        }],
        required: true
    }
});

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;