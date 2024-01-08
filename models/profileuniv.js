// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class profileuniv extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   profileuniv.init({
//     PfUnivID: DataTypes.INTEGER,
//     PfUUserID: DataTypes.INTEGER,
//     PfUnivName: DataTypes.STRING,
//     PfUnivImgUrl: DataTypes.STRING,
//     PfUnivAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'profileuniv',
//   });
//   return profileuniv;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var profileuniv = sequelize.define('profileuniv', {
    PfUnivID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    PfUUserID: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    PfUnivName: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    PfUnivImgUrl: {
      allowNull: true,
      type: DataTypes.STRING(400)
    },
    PfUnivAuth: {
      allowNull: true,
      type: DataTypes.INTEGER(1)
    }
  }, {});

  profileuniv.associate = function (models) {
    this.belongsTo( models.user, {
      foreignKey : "PfUUserID",
      onDelete : "cascade",
    });
  };

  return profileuniv;
};
