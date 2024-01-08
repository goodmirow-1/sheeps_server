'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomDeclare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey : "UserID",
        onDelete : "cascade",
      });
    }
  };
  RoomDeclare.init({
    UserID: DataTypes.INTEGER,
    RoomName: DataTypes.STRING,
    Contents: DataTypes.STRING,
    Type: DataTypes.INTEGER,
    IsProcessing: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'RoomDeclare',
  });
  return RoomDeclare;
};