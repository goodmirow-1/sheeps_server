'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey : "UserID",
        onDelete : "cascade",
      });
      this.hasMany(models.CommunityLike, {
        foreignKey: 'PostID',
      });
      this.hasMany(models.CommunityReply, {
        foreignKey: 'PostID',
      });
      this.hasMany(models.CommunityDeclare, {
        foreignKey: 'TargetID',
      });
      this.hasMany(models.CommunitySubscriber, {
        foreignKey: 'PostID',
      });
    }
  };
  CommunityPost.init({
    UserID: DataTypes.INTEGER,
    Category: DataTypes.STRING,
    Title: DataTypes.STRING,
    Contents: DataTypes.STRING,
    HitCounts: DataTypes.INTEGER,
    ImageUrl1: DataTypes.STRING,
    ImageUrl2: DataTypes.STRING,
    ImageUrl3: DataTypes.STRING,
    IsShow: DataTypes.BOOLEAN,
    Type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityPost',
  });
  return CommunityPost;
};