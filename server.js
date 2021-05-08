

const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db.js')
const mongoose = require('mongoose')
const schema = require('./model/Icon')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()



connectDB()

 let db = mongoose.connection;
 db.on('error', (error) => {
    console.log(error)
 })

 


app.use(express.json({limit: '10mb'}));
app.use(cookieParser())
app.use(session({
    secret: 'secretagent',
    saveUninitialized: false,
    resave:false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 2},
    store: new MongoStore({mongooseConnection: db, 
        ttl: 2 * 24 * 60 * 60})
}))
 
app.use('/', require('./routes/api/ordericon'))
app.use('/', require('./routes/api/catalogue'))
app.use('/', require('./routes/api/cataloguecategory'))
app.use('/', require('./routes/api/search'))
app.use('/', require('./routes/api/icon'))
app.use('/', require('./routes/api/orders'))
app.use('/', require('./routes/api/categories'))
app.use('/', require('./routes/api/cart'))


//error middleware
app.use((req, res, next) => {
    const err = new Error('not found')
    err.status = 404
    next(err)
    
})

app.use((error, req, res, next) => {
    res.status(error.status)
    res.send({
        error: {
            status: error.status,
            message: error.message 
        }
    })
})

const port = process.env ||  3001
app.listen(port, function() {console.log(`app started on port ${port}`)})