'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LimitCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LimitCoupon.init({
    UserID: DataTypes.INTEGER,
    Description: DataTypes.STRING,
    Title: DataTypes.STRING,
    CouponCode: DataTypes.STRING,
    PeriodStart: DataTypes.STRING,
    PeriodEnd: DataTypes.STRING,
    UseFor: DataTypes.STRING,
    URL : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LimitCoupon',
  });
  return LimitCoupon;
};