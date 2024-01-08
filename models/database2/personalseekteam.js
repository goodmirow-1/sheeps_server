'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalSeekTeam extends Model {
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
  PersonalSeekTeam.init({
    UserID: DataTypes.INTEGER,
    Title: DataTypes.STRING,
    SeekingState: DataTypes.INTEGER,
    SelfInfo: DataTypes.STRING,
    Category: DataTypes.STRING,
    SeekingFieldPart: DataTypes.STRING,
    SeekingFieldSubPart: DataTypes.STRING,
    AbilityContents: DataTypes.STRING,
    Education: DataTypes.STRING,
    Career: DataTypes.STRING,
    WorkFormFirst: DataTypes.STRING,
    WorkFormSecond: DataTypes.STRING,
    WorkDayOfWeek: DataTypes.STRING,
    WorkTime: DataTypes.STRING,
    Welfare: DataTypes.STRING,
    NeedWorkConditionContents: DataTypes.STRING,
    Location: DataTypes.STRING,
    SubLocation: DataTypes.STRING,
    IsShow: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PersonalSeekTeam',
  });
  return PersonalSeekTeam;
};