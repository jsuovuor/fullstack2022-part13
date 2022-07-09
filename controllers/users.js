const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}
  if(req.query.read === 'true') where.isRead = 'true'
  if(req.query.read === 'false') where.isRead = 'false'
  const user = await User.findByPk(req.params.id, {
    include: [
      {
      model: Blog
      },
      {
        model: Blog,
        as: 'readlist',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: ['id', 'isRead'],
          where,
        },
      }
  ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(e) {
    next(e)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    user.name = req.body.name
    await user.save()
    res.json(user)
  } catch(e) {
    next(e)
  }
})

module.exports = router