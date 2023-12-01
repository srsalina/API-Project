'use strict';
const { reviewImages } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await reviewImages.bulkCreate([
      {
        reviewId: 1,
        url: 'image1.com'
      },
      {
        reviewId: 2,
        url: 'image2.com'
      },
      {
        reviewId: 3,
        url: 'image3.com'
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'reviewImages';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['image1.com', 'image2.com', 'image3.com'] }
    }, {});
  }
};
