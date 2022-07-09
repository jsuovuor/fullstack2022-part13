const Blog = require('./blog')
const User = require('./user')
const ReadList = require('./readlist')
const Usersession = require("./usersession")

User.hasMany(Blog)
Blog.belongsTo(User)
Usersession.belongsTo(User);

User.belongsToMany(Blog, { through: ReadList, as: 'readlist' })
Blog.belongsToMany(User, { through: ReadList, as: 'readlistUser' })

//.sync poistettu käytöstä. Hoidetaan nykyään migraatioilla
//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
  Blog, User, ReadList, Usersession
}