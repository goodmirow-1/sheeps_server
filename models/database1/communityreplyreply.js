'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityReplyReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CommunityReply,{
        foreignKey : { name : 'ReplyID', allowNull : true},
        onDelete : 'CASCADE',
      });
      this.hasMany(models.CommunityReplyReplyLike, {
        foreignKey: 'ReplyReplyID',
      });
      this.hasMany(models.CommunityReplyReplyDeclare, {
        foreignKey: 'TargetID',
      });
    }
  };
  CommunityReplyReply.init({
    UserID: DataTypes.INTEGER,
    ReplyID: DataTypes.INTEGER,
    Contents: DataTypes.STRING,
    IsShow: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityReplyReply',
  });
  return CommunityReplyReply;
};