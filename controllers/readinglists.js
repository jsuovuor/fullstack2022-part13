const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { ReadList } = require('../models')
const { User } = require('../models')
const { Usersession } = require('../models')
const { sequelize } = require('../util/db')

router.post('/', async (req, res, next) => {
    try {
        const addToReadList = await ReadList.create({ blogId: req.body.blog_id, userId: req.body.user_id })
        res.status(201).json(addToReadList)
    }catch(e) {
        next(e)
    }
})

router.put('/:id', async (req, res) => {
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
  } catch(error){
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const read = await ReadList.findByPk(req.params.id)
  if (!read) {
    return res.status(404)
  }
  if (read.userId === decodedToken.id) {
    read.isRead = req.body.read
    await read.save()
    return res.json(read)
  }
  return res.status(401).json({ error: 'token missing or invalid' })
})

module.exports = router