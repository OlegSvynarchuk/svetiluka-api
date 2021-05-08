const express = require('express')
const router = express.Router({mergeParams: true})
const Icon = require('../../model/Icon.js')



// get all icons 

router.get('/api/catalogue/:category', async (req, res) => {
    const category = req.params.category
    const pageSize = req.query.pageSize  || 6
    const currentPage = req.query.page > 0 ? req.query.page - 1 : 0
    const sortBy = req.query.sortBy || 'name'
    const orderBy = req.query.orderBy || 'asc'
    const sortQuery = {
        [sortBy] : orderBy, id: 1
    }
    
    
    try {
        const itemCount = await Icon.countDocuments({categories: category})
        if(currentPage * pageSize > itemCount) {
            return res.status(400).json([])
        }
        const icons = await Icon.find({categories: category})
        .limit(parseInt(pageSize)).skip(parseInt(currentPage) * parseInt(pageSize)).sort(sortQuery)
        res.json({content: icons,
        page: req.query.page || 1,
        total: itemCount,
        pageSize: pageSize,
        orderBy: orderBy,
        url: `http://localhost:3001${req.url}`
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('error server')
    }
    
})

module.exports = router


