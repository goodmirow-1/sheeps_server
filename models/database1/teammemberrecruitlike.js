'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamMemberRecruitLike extends Model {
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
  TeamMemberRecruitLike.init({
    UserID: DataTypes.INTEGER,
    TargetID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TeamMemberRecruitLike',
  });
  return TeamMemberRecruitLike;
};