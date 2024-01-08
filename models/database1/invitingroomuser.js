'use strict';

const roominfo = require("./roominfo");

module.exports = (sequelize, DataTypes) => {
  var invitingroomuser = sequelize.define('InvitingRoomUser', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    InviteID : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    Response : {
      type : DataTypes.INTEGER,
      allowNull : false,  //기본값 0
    },
  }, {});
  
  invitingroomuser.associate = function (models) {
    invitingroomuser.belongsTo(models.RoomUser, {
        foreignKey : 'id',
        onDelete : 'cascade'
      });
    invitingroomuser.belongsTo(models.RoomInfo, {
        foreignKey : 'id',
        onDelete : 'cascade'
    });
    this.belongsTo(models.user, {
      foreignKey : "UserID",
      onDelete : "cascade",
    });
  };

  return invitingroomuser;
};