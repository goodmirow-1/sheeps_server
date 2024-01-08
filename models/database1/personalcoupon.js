'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalCoupon extends Model {
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
  PersonalCoupon.init({
    UserID: DataTypes.INTEGER,
    Type: DataTypes.INTEGER,
    CouponID: DataTypes.INTEGER,
    State : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PersonalCoupon',
  });
  return PersonalCoupon;
};