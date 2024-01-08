'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChatLog.init({
    roomName: DataTypes.STRING,
    to: DataTypes.INTEGER,
    from: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isImage: DataTypes.INTEGER,
    isSend: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatLog',
  });
  return ChatLog;
};