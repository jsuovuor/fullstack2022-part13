const { sequelize } = require('../util/db')
const { Model, DataTypes } = require('sequelize')

class ReadList extends Model {}

ReadList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { key: 'id', model: 'users' },
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { key: 'id', model: 'blogs' },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readList'
})

module.exports = ReadList