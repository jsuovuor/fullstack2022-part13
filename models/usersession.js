const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Usersession extends Model {}

Usersession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'activesessions',
    timestamps: false,
  }
)

module.exports = Usersession