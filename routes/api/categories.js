const express = require('express');
const icons = require('../../model/Icon.js')
const router = express.Router({mergeParams: true})

router.get('/api/categories',  async (req, res) => {
    try {
        const categories = await icons.distinct('categories')
        res.send(categories)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})

module.exports = router