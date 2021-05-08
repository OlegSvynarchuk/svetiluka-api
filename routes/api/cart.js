const express = require('express')
const router = express.Router()

//update cart
router.post('/api/cart', (req, res) => {
    let cart = req.body;
    req.session.cart = cart;
    req.session.save((err) => {
        if(err) {
            throw err
        }
        res.json(req.session.cart)
    })

} )

//get items from cart
router.get('/api/cart', (req, res) => {
       
        res.json(req.session.cart || [])
})


module.exports = router