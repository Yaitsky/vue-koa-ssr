/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11), // Field Type
      allowNull: false, // Whether to allow NULL
      primaryKey: true, // The main key
      autoIncrement: true // Whether self-increase
    },
    user_name: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(128),
      allowNull: false
    }
  }, {
    tableName: 'user'
  })
};
