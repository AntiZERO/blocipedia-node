'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    body: {
      allowNull: false,
      type: DataTypes.STRING
    },
    private: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Wiki.associate = function (models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    });

  };
  return Wiki;
};