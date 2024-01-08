
'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    UserID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RealName: {
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: ""
    },
    Information: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Job: {
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: ""
    },
    Part:{
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: ""
    },
    SubJob: {
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: ""
    },
    SubPart:{
      type: DataTypes.STRING(40),
      allowNull: true,
      defaultValue: ""
    },
    Location: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    SubLocation : {
      type : DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    Badge1 :{
      type :DataTypes.INTEGER,
      allowNull : true,
      defaultValue: "0"
    },
    Badge2 :{
      type :DataTypes.INTEGER,
      allowNull : true,
      defaultValue: "0"
    },
    Badge3 :{
      type :DataTypes.INTEGER,
      allowNull : true,
      defaultValue: "0"
    },
    PhoneAuth: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    PhoneNumber: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    RefreshToken: {
      type: DataTypes.STRING(400),
      allowNull: true,
      defaultValue: "0"
    },
    Google: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    Premium:{
      type: DataTypes.BOOLEAN,      
      allowNull: true
    },
    MarketingAgree: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: "1"
    },
    MarketingAgreeTime: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LoginState: {
      type : DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
  }, {});
  user.associate = function (models) {

    this.hasMany(models.team, {
      foreignKey: 'LeaderID',
    });
    this.hasMany(models.InvitingRoomUser, {
      foreignKey: 'UserID',
    });
    this.hasMany(models.FcmTokenList, {
      foreignKey: 'UserID',
    });
    // this.hasMany(models.RoomUser, {
    //   foreignKey: 'UserID',
    // });
    // this.hasMany(models.RoomDeclare, {
    //   foreignKey: 'UserID',
    // });
    this.hasMany(models.NotificationList, {
      foreignKey: 'TargetID',
    });
    this.hasMany(models.PersonalBadgeList, {
      foreignKey: 'UserID',
    });
    this.hasMany(models.PersonalPhoto, {
      foreignKey: 'UserID',
    });
    this.hasMany(models.profilecareer, {
      foreignKey: 'PfCUserID'
    });
    this.hasMany(models.profilelicense, {
      foreignKey: 'PfLUserID'
    });
    this.hasMany(models.profileuniv, {
      foreignKey: 'PfUUserID'
    });
    this.hasMany(models.profilewin, {
      foreignKey: 'PfWUserID'
    });
    this.hasMany(models.PersonalLinks, {
      foreignKey: 'UserID'
    });
    this.hasMany(models.PersonalLike, {
      foreignKey: 'UserID',
    });
    this.hasMany(models.TeamLike, {
      foreignKey: 'UserID',
    });
    this.hasMany(models.PersonalSeekTeam, {
      foreignKey: 'UserID',
    });
  };
  return user;
};