// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class teamauth extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   teamauth.init({
//     TAuthID: DataTypes.INTEGER,
//     id: DataTypes.INTEGER,
//     TAuthContents: DataTypes.STRING,
//     TAuthImgUrl: DataTypes.STRING,
//     TAuthAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'teamauth',
//   });
//   return teamauth;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var teamauth = sequelize.define('teamauth', {
    TAuthID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    TATeamID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    TAuthContents: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TAuthImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TAuthAuth: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {});
  teamauth.associate = function (models) {
    this.belongsTo(models.team, {
      foreignKey : "TATeamID",
      onDelete : "cascade",
    });
  };
  return teamauth;
};
