
'use strict';
module.exports = (sequelize, DataTypes) => {
  var profilecareer = sequelize.define('profilecareer', {
    PfCareerID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    PfCUserID: {
      type: DataTypes.INTEGER
    },
    PfCareerContents: {
      type: DataTypes.STRING(255)
    },
    PfCareerImgUrl: {
      type: DataTypes.STRING(400),
    },
    PfCareerAuth: {
      type: DataTypes.INTEGER(1)
    }
  }, {});
  
  profilecareer.associate = function (models) {
    profilecareer.belongsTo( models.user, {
      foreignKey : "PfCUserID",
      onDelete : "cascade",
    });
  };

  return profilecareer;
};
