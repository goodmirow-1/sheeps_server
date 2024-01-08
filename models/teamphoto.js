'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeamPhoto extends Model {
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
  TeamPhoto.init({
    TeamID: DataTypes.INTEGER,
    Index: DataTypes.INTEGER,
    ImgUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TeamPhoto',
  });
  return TeamPhoto;
};