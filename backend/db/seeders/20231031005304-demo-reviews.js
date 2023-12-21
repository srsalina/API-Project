'use strict';
const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 3,
        userId: 1,
        review: "President Bush was a great host!",
        stars: 1,

      },
      {
        spotId: 1,
        userId: 2,
        review: "Eh I've had better",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "It was ok",
        stars: 3
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      stars: { [Op.in]: [1, 3, 5] }
    }, {});
  }
};
