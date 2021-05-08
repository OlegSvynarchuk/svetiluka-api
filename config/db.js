






const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.DB_URI



const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('mongodb connected')
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB
