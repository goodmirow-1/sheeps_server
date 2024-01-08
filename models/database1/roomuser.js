'use strict';
module.exports = (sequelize, DataTypes) => {
  var roomuser = sequelize.define('RoomUser', {
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
    RoomID : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    Alarm : {
      type : DataTypes.INTEGER,
      allowNull : false,
    }
  }, {});
  
  roomuser.associate = function (models) {
    this.belongsTo( models.user, {
      foreignKey : "UserID",
      onDelete : "cascade",
    });
  };

  return roomuser;
};