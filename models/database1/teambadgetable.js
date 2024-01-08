'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamBadgeTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TeamBadgeTable.init({
    BadgeID: DataTypes.INTEGER,
    Category: DataTypes.INTEGER,
    Part: DataTypes.STRING,
    Condition: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TeamBadgeTable',
  });
  return TeamBadgeTable;
};