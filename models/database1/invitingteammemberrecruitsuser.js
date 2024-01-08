'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvitingTeamMemberRecruitsUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  InvitingTeamMemberRecruitsUser.init({
    UserID: DataTypes.INTEGER,
    InviteID: DataTypes.INTEGER,
    Response: DataTypes.INTEGER,
    TargetIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvitingTeamMemberRecruitsUser',
  });
  return InvitingTeamMemberRecruitsUser;
};