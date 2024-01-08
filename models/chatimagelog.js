'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatImageLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChatImageLog.init({
    UserID: DataTypes.INTEGER,
    Data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatImageLog',
  });
  return ChatImageLog;
};