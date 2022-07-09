const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog } = require('../models')
const { User } = require('../models')
const { Usersession } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {

    where = {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search } },
        { author: { [Op.substring]: req.query.search } }
      ]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User
    },
    where,
    order: [['likes', 'DESC']],
  })
    res.json(blogs)
  })

  router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })
  
  
  router.post('/', async (req, res, next) => {
      let decodedToken
      try {
        decodedToken = jwt.verify(req.token, process.env.JWTKEY)
        const activeSession = await Usersession.findOne({where: {token: req.token}})
        if(!activeSession) return res.status(401).json({ error: 'token missing or invalid' }) 
        const user = await User.findByPk(decodedToken.id)
        if (user.disabled) {
          return response.status(401).json({
            error: 'account disabled, please contact admin'
          })
        }
        const blog = await Blog.create({ ...req.body, userId: user.id })
        return res.json(blog)
      } catch(e) {
        next(e)
      }
    })

    router.put('/:id', blogFinder, async (req, res, next) => {
        if (req.blog) {
          req.blog.likes = req.body.likes
          try {
            await req.blog.save()
            res.json(req.blog)
          } catch(e) {
            next(e)
          }    
        } else {
          res.status(404).end()
        }
      })
  
    router.delete('/:id', blogFinder, async (req, res) => {
        let decodedToken
        try {
          decodedToken = jwt.verify(req.token, process.env.JWTKEY)
          const activeSession = await Usersession.findOne({where: {token: req.token}})
          const user = await User.findByPk(decodedToken.id)
          if (user.disabled) {
            return response.status(401).json({
              error: 'account disabled, please contact admin'
            })
          }
          if(!activeSession) return res.status(401).json({ error: 'token missing or invalid' }) 
        } catch(error){
          return res.status(401).json({ error: 'token missing or invalid' })
        }

        if (req.blog.userId === decodedToken.id) {
            await req.blog.destroy()
            return res.status(204)
        }

        return res.status(401).json({ error: 'token missing or invalid' })
    })

    module.exports = router