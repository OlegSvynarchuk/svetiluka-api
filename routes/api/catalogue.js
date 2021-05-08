const express = require('express')
const router = express.Router()
const Icon = require('../../model/Icon.js')
let  cache = require('memory-cache')





// get all icons 

router.get('/api/catalogue',  async (req, res) => {
    const pageSize = req.query.pageSize  || 6
    const currentPage = req.query.page > 0 ? req.query.page - 1 : 0
    const sortBy = req.query.sortBy || 'name'
    const orderBy = req.query.orderBy || 'asc'
    const filter = req.query.filter || ''
    const filterOn = req.query.filterOn || ""
    const sortQuery = {
        [sortBy] : orderBy, id: 1
    }
    let filterQuery = {}
    if (filter.length > 0) {
        const regx = new RegExp(filter, 'i')
        if(filterOn.length > 0) {
            filterQuery = {
                    [filterOn]: filter
            } 

             
        } else {
            filterQuery = {
                name: regx
            }
        }
    }
    
    try {
        const itemCount = await Icon.countDocuments(filterQuery)
        if(currentPage * pageSize > itemCount) {
            return res.status(400).json([])
        }
        const icons = await Icon.find(filterQuery)
        .limit(parseInt(pageSize)).skip(parseInt(currentPage) * parseInt(pageSize)).sort(sortQuery)
      res.set('Cache-control', 'public, max-age=300')
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


