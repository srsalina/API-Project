'use strict';

const { booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await booking.bulkCreate([
      {
        spotId: 3,
        userId: 1,
        startDate: '02/05/23',
        endDate: '02/13/23'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '12/28/23',
        endDate: '01/10/24'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '01/11/24',
        endDate: '01/19/24'
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'bookings';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
