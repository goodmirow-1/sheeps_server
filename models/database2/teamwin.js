// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class teamwin extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   teamwin.init({
//     TWinID: DataTypes.INTEGER,
//     id: DataTypes.INTEGER,
//     TWinContents: DataTypes.STRING,
//     TWinImgUrl: DataTypes.STRING,
//     TWinAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'teamwin',
//   });
//   return teamwin;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var teamwin = sequelize.define('teamwin', {
    TWinID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    TWTeamID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    TWinContents: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TWinImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TWinAuth: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {});
  teamwin.associate = function (models) {
    this.belongsTo(models.team, {
      foreignKey : "TWTeamID",
      onDelete : "cascade",
    });
  };
  return teamwin;
};
