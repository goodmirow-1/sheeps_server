'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teamlinks extends Model {
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
  teamlinks.init({
    TeamID: DataTypes.INTEGER,
    Site: DataTypes.STRING,
    Recruit: DataTypes.STRING,
    Instagram: DataTypes.STRING,
    Facebook: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'teamlinks',
  });
  return teamlinks;
};