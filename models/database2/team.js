'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey : "LeaderID",
        onDelete : "cascade",
      });
      this.hasMany(models.InvitingTeamUsers, {
        foreignKey: 'TeamID',
      });
      this.hasMany(models.TeamPhoto, {
        foreignKey: 'TeamID',
      });
      this.hasMany(models.TeamList, {
        foreignKey: 'TeamID',
      });
      this.hasMany(models.TeamBadgeList, {
        foreignKey: 'TeamID',
      });
      this.hasMany(models.teamauth, {
        foreignKey: 'TATeamID',
      });
      this.hasMany(models.teamperformance, {
        foreignKey: 'TPTeamID',
      });
      this.hasMany(models.teamwin, {
        foreignKey: 'TWTeamID',
      });
      this.hasMany(models.teamlinks, {
        foreignKey: 'TeamID',
      });
      this.hasMany(models.TeamMemberRecruit, {
        foreignKey: 'TeamID',
      })
    }
  };
  team.init({
    LeaderID: DataTypes.INTEGER,
    Name: DataTypes.STRING,
    Information: DataTypes.STRING,
    Category: DataTypes.STRING,
    Part: DataTypes.STRING,
    Location: DataTypes.STRING,
    SubLocation: DataTypes.STRING,
    PossibleJoin: DataTypes.INTEGER,
    Badge1: DataTypes.INTEGER,
    Badge2: DataTypes.INTEGER,
    Badge3: DataTypes.INTEGER,
    IsShow: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'team',
  });
  return team;
};