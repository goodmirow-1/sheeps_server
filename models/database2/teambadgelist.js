'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamBadgeList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.team, {
        foreignKey : "TeamID",
        onDelete : "cascade",
      });
    }
  };
  TeamBadgeList.init({
    TeamID: DataTypes.INTEGER,
    BadgeID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TeamBadgeList',
  });
  return TeamBadgeList;
};