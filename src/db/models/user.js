'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0       // 0 (Free) / 1 (Premium) / 2 (Admin)
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "An account with that email already exists"
      },
      validate: {
        isEmail: { msg: "Must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined 
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

  };
  return User;
};