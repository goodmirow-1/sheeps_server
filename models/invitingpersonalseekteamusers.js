'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvitingPersonalSeekTeamUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  InvitingPersonalSeekTeamUser.init({
    TeamID: DataTypes.INTEGER,
    InviteID: DataTypes.INTEGER,
    Response: DataTypes.INTEGER,
    TargetIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvitingPersonalSeekTeamUser',
  });
  return InvitingPersonalSeekTeamUser;
};