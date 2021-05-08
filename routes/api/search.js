const express = require('express')
const router = express.Router()
const Icon = require('../../model/Icon.js')



// search icons 

router.get('/api/search', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 6;
    const currentPage = req.query.page > 0 ? req.query.page -1 : 0
    const sortBy = req.query.sortBy || 'name'
    const orderBy = req.query.orderBy || 'asc'
    let filter = req.query.filter || ''
    const category = req.query.category || ''
    const sortQuery = {
        [sortBy] : orderBy, id: 1
    }
    filter = new RegExp(filter, 'i')
    let filterQuery = {}
    if(category) {
        filterQuery = {
            name: filter, categories: category
        }
    } else {
        filterQuery = {
            name: filter
        }
    }
    
    
    try {
        const itemCount = await Icon.countDocuments(filterQuery)
      if(currentPage * pageSize > itemCount) {
            return res.status(400).json([])
        } 
        
        const icons = await Icon.find(filterQuery)
        .limit(pageSize).skip(currentPage * pageSize).sort(sortQuery)
        res.json({content: icons,
        page: req.query.page || 1,
        total: itemCount,
        pageSize: pageSize,
        orderBy: orderBy,
        searchWord: req.query.filter,
        category: category,
        
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('error server')
    }
    
})

module.exports = router
