const faker = require("faker");
const { factory } = require("factory-girl");
const { User } = require("../src/app/models");

factory.define("User", User, {
  name: faker.name.findName(),
  city: faker.address.city(10),
  country: faker.address.country(),
  favorite_sport: faker.lorem.word()
});

module.exports = factory;
