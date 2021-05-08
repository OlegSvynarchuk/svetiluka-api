const mongoose = require('mongoose')

const IconSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    
    dimension: {
        type: String,
    },

    categories: {
        type: [String]
    },

    slava: {
        type: String
    },

    size: {
        type: [String]
    },

    board: {
        type: [String]
    },
})

module.exports = Icon = mongoose.model('icon', IconSchema)