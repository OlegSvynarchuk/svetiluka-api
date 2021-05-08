const express = require('express');
const icons = require('../../model/Icon.js')
const router = express.Router({mergeParams: true})

router.get('/api/catalogue/:category/:id',  async (req, res) => {
    try {
        const icon = await icons.findOne({id: req.params.id})
        res.send(icon)
    } catch (error) {
        res.status(500).send('server error')
    }
})

module.exports = router