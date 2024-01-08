'use strict';
module.exports = (sequelize, DataTypes) => {
  var roominfo = sequelize.define('RoomInfo', {
    RoomID : {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    RoomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Type : {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue: 1
    },
    MAX : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
  }, {});
  
  roominfo.associate = function (models) {
    roominfo.hasMany(models.RoomUser,{
      foreignKey : 'RoomID',
    });
  };

  return roominfo;
};
