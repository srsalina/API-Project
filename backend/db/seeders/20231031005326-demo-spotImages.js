'use strict';
const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'spotimage1.com',
        preview: false
      },
      {
        spotId: 2,
        url: 'spotimage2.com',
        preview: false
      },
      {
        spotId: 3,
        url: 'spotimage3.com',
        preview: false
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['spotimage1.com', 'spotimage2.com', 'spotimage3.com'] }
    }, {});
  }
};
