// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class profilewin extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   profilewin.init({
//     PfWinID: DataTypes.INTEGER,
//     PfWUserID: DataTypes.INTEGER,
//     PfWinContents: DataTypes.STRING,
//     PfWinImgUrl: DataTypes.STRING,
//     PfWinAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'profilewin',
//   });
//   return profilewin;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var profilewin = sequelize.define('profilewin', {
    PfWinID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    PfWUserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    PfWinContents: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PfWinImgUrl:{
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PfWinAuth:{
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {});
  
  profilewin.associate = function (models) {
    this.belongsTo( models.user, {
      foreignKey : "PfWUserID",
      onDelete : "cascade",
    });
  };

  return profilewin;
};
