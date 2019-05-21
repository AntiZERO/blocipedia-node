'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Collaborator.addScope("collaboratorsFor", (wikiId) => {
      return {
        include: [{
          model: models.Wiki
        }],
        where: {wikiId: wikiId},
        order: [["createdAt", "ASC" ]]
      }
    });

    Collaborator.addScope("usernamesFor", (userId) => {
      return {
        include: [{
          model: models.user
        }],
        where: {userId: userId},
        order: [["username", "ASC"]]
      }
    });

  };
  return Collaborator;
};