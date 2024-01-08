'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalLinks extends Model {
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
  PersonalLinks.init({
    UserID: DataTypes.INTEGER,
    Portfolio: DataTypes.STRING,
    Resume: DataTypes.STRING,
    Site: DataTypes.STRING,
    LinkedIn: DataTypes.STRING,
    Instagram: DataTypes.STRING,
    Facebook: DataTypes.STRING,
    Github: DataTypes.STRING,
    Notion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonalLinks',
  });
  return PersonalLinks;
};