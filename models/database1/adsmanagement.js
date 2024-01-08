'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdsManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AdsManagement.init({
    Sponser: DataTypes.STRING,
    type: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    ImageUrl: DataTypes.STRING,
    LinkUrl: DataTypes.STRING,
    PeriodStart: DataTypes.STRING,
    PeriodEnd: DataTypes.STRING,
    ClickCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdsManagement',
  });
  return AdsManagement;
};