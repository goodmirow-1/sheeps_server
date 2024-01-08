'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvitingTeamUsers extends Model {
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
  InvitingTeamUsers.init({
    TeamID: DataTypes.INTEGER,
    InvitingID: DataTypes.INTEGER,
    Response: DataTypes.INTEGER //기본값 0
  }, {
    sequelize,
    modelName: 'InvitingTeamUsers',
  });
  return InvitingTeamUsers;
};