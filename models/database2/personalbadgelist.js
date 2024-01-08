'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalBadgeList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      this.belongsTo( models.user, {
        foreignKey : "UserID",
        onDelete : "cascade",
      });
    }
  };
  PersonalBadgeList.init({
    UserID: DataTypes.INTEGER,
    BadgeID: DataTypes.INTEGER,
    Type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PersonalBadgeList',
  });
  return PersonalBadgeList;
};