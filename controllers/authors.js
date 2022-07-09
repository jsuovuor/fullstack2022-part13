const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
      attributes: [ 'author',
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        [sequelize.fn('COUNT', sequelize.col('author')), 'blogs']
      ],
      group: 'author'
    })
    return res.json(authors)
  })
  
  module.exports = router