// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class profilelicense extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   profilelicense.init({
//     PfLicenseID: DataTypes.INTEGER,
//     PfLUserID: DataTypes.INTEGER,
//     PfLicenseContents: DataTypes.STRING,
//     PfLicenseImgUrl: DataTypes.STRING,
//     PfLicenseAuth: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'profilelicense',
//   });
//   return profilelicense;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var profilelicense = sequelize.define('profilelicense', {
    PfLicenseID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    PfLUserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PfLicenseContents: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PfLicenseImgUrl: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PfLicenseAuth: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {});
  
  profilelicense.associate = function (models) {
    this.belongsTo( models.user, {
      foreignKey : "PfLUserID",
      onDelete : "cascade",
    });
  };

  return profilelicense;
};
