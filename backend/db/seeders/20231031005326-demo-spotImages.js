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
        url: 'https://nypost.com/wp-content/uploads/sites/2/2022/03/Arkup-67.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-11818704/original/d7279902-a71b-4fbc-a711-3172286ab458.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-645734927755358154/original/ee26e961-bd79-4423-8791-df80f8c7382c.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/bJL07',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/bJL07',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/bJL07',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/bJL07',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/bJL07',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/dmOQ0',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/dmOQ0',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/dmOQ0',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/dmOQ0',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/dmOQ0',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://shorturl.at/hit56',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://shorturl.at/hit56',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://shorturl.at/hit56',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://shorturl.at/hit56',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://shorturl.at/hit56',
        preview: false
      },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: true },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: false },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: false },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: false },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: false },
      { spotId: 7, url: 'https://shorturl.at/begAQ', preview: false },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: true },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: false },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: false },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: false },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: false },
      { spotId: 8, url: 'https://shorturl.at/dnrHM', preview: false },

      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: true },
      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: false },
      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: false },
      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: false },
      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: false },
      { spotId: 9, url: 'https://shorturl.at/lqERV', preview: false },

      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: true },
      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: false },
      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: false },
      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: false },
      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: false },
      { spotId: 10, url: 'https://shorturl.at/dnAEY', preview: false },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['spotimage1.com', 'spotimage2.com', 'spotimage3.com','https://shorturl.at/bJL07','https://shorturl.at/dmOQ0','https://shorturl.at/hit56','https://shorturl.at/begAQ','https://shorturl.at/dnrHM','https://shorturl.at/lqERV','https://shorturl.at/dnAEY'] }
    }, {});
  }
};
