'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityReplySubscriber extends Model {
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
    }
  };
  CommunityReplySubscriber.init({
    ReplyID: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityReplySubscriber',
  });
  return CommunityReplySubscriber;
};