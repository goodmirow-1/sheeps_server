'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CommunityPost,{
        foreignKey : { name : 'PostID', allowNull : true},
        onDelete : 'CASCADE',
      });
      this.hasMany(models.CommunityReplyLike, {
        foreignKey: 'ReplyID',
      });
      this.hasMany(models.CommunityReplyReply, {
        foreignKey: 'ReplyID',
      });
      this.hasMany(models.CommunityReplyDeclare, {
        foreignKey: 'TargetID',
      });
      this.hasMany(models.CommunityReplySubscriber, {
        foreignKey: 'ReplyID',
      })
    }
  };
  CommunityReply.init({
    UserID: DataTypes.INTEGER,
    PostID: DataTypes.INTEGER,
    Contents: DataTypes.STRING,
    IsShow: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityReply',
  });
  return CommunityReply;
};