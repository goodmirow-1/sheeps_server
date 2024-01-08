'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamMemberRecruit extends Model {
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
  TeamMemberRecruit.init({
    TeamID: DataTypes.INTEGER,
    Title: DataTypes.STRING,
    RecruitPeriodStart: DataTypes.STRING,
    RecruitPeriodEnd: DataTypes.STRING,
    RecruitInfo: DataTypes.STRING,
    ServicePart: DataTypes.STRING,
    Location: DataTypes.STRING,
    SubLocation: DataTypes.STRING,
    Category: DataTypes.STRING,
    RecruitField: DataTypes.STRING,
    RecruitSubField: DataTypes.STRING,
    RoleContents: DataTypes.STRING,
    Education: DataTypes.STRING,
    Career: DataTypes.STRING,
    DetailVolunteerQualification: DataTypes.STRING,
    PreferenceInfo: DataTypes.STRING,
    DetailPreferenceInfoContents: DataTypes.STRING,
    WorkFormFirst: DataTypes.STRING,
    WorkFormSecond: DataTypes.STRING,
    WorkDayOfWeek: DataTypes.STRING,
    WorkTime: DataTypes.STRING,
    Welfare: DataTypes.STRING,
    DetailWorkCondition: DataTypes.STRING,
    IsShow: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TeamMemberRecruit',
  });
  return TeamMemberRecruit;
};