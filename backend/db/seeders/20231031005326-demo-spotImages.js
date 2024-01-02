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
        url: 'http://tinyurl.com/4c8t6vsz',
        preview: true
      },
      { spotId: 1, url: 'http://tinyurl.com/4c8t6vsz', preview: false },
      { spotId: 1, url: 'http://tinyurl.com/4c8t6vsz', preview: false },
      { spotId: 1, url: 'http://tinyurl.com/4c8t6vsz', preview: false },
      { spotId: 1, url: 'http://tinyurl.com/4c8t6vsz', preview: false },
      { spotId: 1, url: 'http://tinyurl.com/4c8t6vsz', preview: false },
      {
        spotId: 2,
        url: 'http://tinyurl.com/bdf9uwww',
        preview: true
      },
      { spotId: 2, url: 'https://shorturl.at/opxJ3', preview: false },
      { spotId: 2, url: 'https://shorturl.at/aeiCW', preview: false },
      { spotId: 2, url: 'http://tinyurl.com/y5bvjrnr', preview: false },
      { spotId: 2, url: 'http://tinyurl.com/bdfheje8', preview: false },
      { spotId: 2, url: 'http://tinyurl.com/4kh8hfzh', preview: false },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-645734927755358154/original/ee26e961-bd79-4423-8791-df80f8c7382c.jpeg?im_w=1200',
        preview: true
      },
      { spotId: 3, url: 'http://tinyurl.com/mryzx7ez', preview: false },
      { spotId: 3, url: 'http://tinyurl.com/4pm22cux', preview: false },
      { spotId: 3, url: 'http://tinyurl.com/32khd4v3', preview: false },
      { spotId: 3, url: 'http://tinyurl.com/mvn4982p', preview: false },
      { spotId: 3, url: 'http://tinyurl.com/umxjbvc7', preview: false },
      {
        spotId: 4,
        url: 'https://shorturl.at/fpqG6',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/ahVY0',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/giU59',
        preview: false
      },
      {
        spotId: 4,
        url: 'http://tinyurl.com/3edme932',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://shorturl.at/lsIOS',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://shorturl.at/enuW9',
        preview: true
      },
      {
        spotId: 5,
        url: 'http://tinyurl.com/3chkxypb',
        preview: false
      },
      {
        spotId: 5,
        url: 'http://tinyurl.com/wubr2t24',
        preview: false
      },
      {
        spotId: 5,
        url: 'http://tinyurl.com/45dyenrz',
        preview: false
      },
      {
        spotId: 5,
        url: 'http://tinyurl.com/469wx2sv',
        preview: false
      },
      {
        spotId: 6,
        url: 'http://tinyurl.com/2vcbmmwd',
        preview: true
      },
      {
        spotId: 6,
        url: 'http://tinyurl.com/3kjessps',
        preview: false
      },
      {
        spotId: 6,
        url: 'http://tinyurl.com/3ysusykd',
        preview: false
      },
      {
        spotId: 6,
        url: 'http://tinyurl.com/cw375psj',
        preview: false
      },
      {
        spotId: 6,
        url: 'http://tinyurl.com/y7swbs3t',
        preview: false
      },
      { spotId: 7, url: 'http://tinyurl.com/ysxycw8n', preview: true },
      { spotId: 7, url: 'http://tinyurl.com/mtzxpwz6', preview: false },
      { spotId: 7, url: 'http://tinyurl.com/5facjfhj', preview: false },
      { spotId: 7, url: 'http://tinyurl.com/yeyrfspa', preview: false },
      { spotId: 7, url: 'http://tinyurl.com/43d7rzpb', preview: false },
      { spotId: 7, url: 'http://tinyurl.com/5fk4cyf9', preview: false },

      { spotId: 8, url: 'http://tinyurl.com/bddmvax8', preview: true },
      { spotId: 8, url: 'http://tinyurl.com/yc4cf32p', preview: false },
      { spotId: 8, url: 'http://tinyurl.com/2fjjcx6y', preview: false },
      { spotId: 8, url: 'http://tinyurl.com/3zwjd6zn', preview: false },
      { spotId: 8, url: 'http://tinyurl.com/bddmvax8', preview: false },
      { spotId: 8, url: 'http://tinyurl.com/bddmvax8', preview: false },

      { spotId: 9, url: 'http://tinyurl.com/88bm8ebk', preview: true },
      { spotId: 9, url: 'http://tinyurl.com/4kfyfxw7', preview: false },
      { spotId: 9, url: 'http://tinyurl.com/2k52cunj', preview: false },
      { spotId: 9, url: 'http://tinyurl.com/5hh6us45', preview: false },
      { spotId: 9, url: 'http://tinyurl.com/5cbmkd8e', preview: false },
      { spotId: 9, url: 'http://tinyurl.com/3262e3dn', preview: false },

      { spotId: 10, url: 'http://tinyurl.com/yc5tzahf', preview: true },
      { spotId: 10, url: 'http://tinyurl.com/2c5szs32', preview: false },
      { spotId: 10, url: 'http://tinyurl.com/yvwf2xp9', preview: false },
      { spotId: 10, url: 'https://shorturl.at/qswVZ', preview: false },
      { spotId: 10, url: 'https://shorturl.at/kxH46', preview: false },
      { spotId: 10, url: 'https://shorturl.at/cHIM0', preview: false },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://shorturl.at/fpqG6','https://shorturl.at/ahVY0','https://shorturl.at/giU59','http://tinyurl.com/3edme932','https://shorturl.at/lsIOS','https://shorturl.at/enuW9','http://tinyurl.com/3chkxypb','http://tinyurl.com/wubr2t24','http://tinyurl.com/45dyenrz','http://tinyurl.com/469wx2sv','http://tinyurl.com/2vcbmmwd','http://tinyurl.com/3kjessps','http://tinyurl.com/3ysusykd','http://tinyurl.com/cw375psj','http://tinyurl.com/y7swbs3t','http://tinyurl.com/ysxycw8n','http://tinyurl.com/mtzxpwz6','http://tinyurl.com/5facjfhj','http://tinyurl.com/yeyrfspa','http://tinyurl.com/43d7rzpb','http://tinyurl.com/5fk4cyf9','http://tinyurl.com/bddmvax8','http://tinyurl.com/yc4cf32p','http://tinyurl.com/2fjjcx6y','http://tinyurl.com/3zwjd6zn','http://tinyurl.com/88bm8ebk','http://tinyurl.com/4kfyfxw7','http://tinyurl.com/2k52cunj','http://tinyurl.com/5hh6us45','http://tinyurl.com/5cbmkd8e','http://tinyurl.com/3262e3dn','http://tinyurl.com/yc5tzahf','http://tinyurl.com/2c5szs32','http://tinyurl.com/yvwf2xp9','https://shorturl.at/qswVZ','https://shorturl.at/kxH46','https://shorturl.at/cHIM0','https://shorturl.at/opxJ3','https://shorturl.at/aeiCW','http://tinyurl.com/y5bvjrnr','http://tinyurl.com/bdfheje8','http://tinyurl.com/4kh8hfzh','http://tinyurl.com/bdf9uwww','http://tinyurl.com/mryzx7ez','http://tinyurl.com/4pm22cux','http://tinyurl.com/32khd4v3','http://tinyurl.com/mvn4982p','http://tinyurl.com/umxjbvc7','http://tinyurl.com/4c8t6vsz'] }
    }, {});
  }
};
