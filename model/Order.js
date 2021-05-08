const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    address: String,
    message: String,
    items: [Object],
    phone: Number, 
    totalPrice: Number

})

module.exports = Order = mongoose.model('order', OrderSchema)