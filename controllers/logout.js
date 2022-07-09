const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { Usersession } = require('../models')

router.delete('/', async (req, res) => {
    let decodedToken
      try {
        decodedToken = jwt.verify(req.token, process.env.JWTKEY)
        const user = await User.findByPk(decodedToken.id)
        await Usersession.destroy({ where: { user_id: decodedToken.id } })
      } catch(e) {
        next(e)
      }
    res.status(204).end()
  })
  
  module.exports = router