'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalBadgeTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PersonalBadgeTable.init({
    BadgeID: DataTypes.INTEGER,
    Category: DataTypes.INTEGER,
    Part: DataTypes.STRING,
    Condition: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PersonalBadgeTable',
  });
  return PersonalBadgeTable;
};