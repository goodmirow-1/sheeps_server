'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CommunityPost,{
        foreignKey : { name : 'PostID', allowNull : true},
        onDelete : 'CASCADE'
      });
    }
  };
  CommunityLike.init({
    UserID: DataTypes.INTEGER,
    PostID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityLike',
    // defaultScope: {
    //   where: {
    //     PostID : true
    //   }
    // }
  });
  return CommunityLike;
};