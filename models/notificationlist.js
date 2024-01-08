'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey : "TargetID",
        onDelete : "cascade",
      });
    }
  };
  NotificationList.init({
    UserID: DataTypes.INTEGER,
    TargetID: DataTypes.INTEGER,
    Type: DataTypes.STRING,
    TableIndex: DataTypes.INTEGER,
    TargetIndex: DataTypes.INTEGER,
    TeamIndex: DataTypes.INTEGER,
    Time: DataTypes.STRING,
    isSend: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NotificationList',
  });
  return NotificationList;
};