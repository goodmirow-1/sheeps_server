'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityReplyReplyLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CommunityReplyReply,{
        foreignKey : { name : 'ReplyReplyID', allowNull : true},
        onDelete : 'CASCADE',
      });
    }
  };
  CommunityReplyReplyLike.init({
    UserID: DataTypes.INTEGER,
    ReplyReplyID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityReplyReplyLike',
  });
  return CommunityReplyReplyLike;
};