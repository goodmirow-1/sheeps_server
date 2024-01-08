// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class teamperformance extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   teamperformance.init({
//     TPerformID: DataTypes.INTEGER,
//     id: DataTypes.INTEGER,
//     TPerformContents: DataTypes.STRING,
//     TPerformImgUrl: DataTypes.STRING,
//     TPerformAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'teamperformance',
//   });
//   return teamperformance;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var teamperformance = sequelize.define('teamperformance', {
    TPerformID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    TPTeamID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    TPerformContents: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TPerformImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    TPerformAuth: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {});
  teamperformance.associate = function (models) {
    this.belongsTo(models.team, {
      foreignKey : "TPTeamID",
      onDelete : "cascade",
    });
  };
  return teamperformance;
};

