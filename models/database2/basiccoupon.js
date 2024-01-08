'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BasicCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BasicCoupon.init({
    Title: DataTypes.STRING,
    Description: DataTypes.STRING,
    CouponCode: DataTypes.STRING,
    PeriodStart: DataTypes.STRING,
    PeriodEnd: DataTypes.STRING,
    UseFor: DataTypes.STRING,
    MainColor: DataTypes.STRING,
    URL: DataTypes.STRING,
    ContentsURL: DataTypes.STRING,
    RemainedCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BasicCoupon',
  });
  return BasicCoupon;
};