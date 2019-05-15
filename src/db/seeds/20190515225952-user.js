'use strict';
const faker = require("faker");

let users = [];

for(let i = 1 ; i <= 3 ; i++){
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: i-1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete("Users", null, {});
  }
};