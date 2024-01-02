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
      },
      { spotId: 4,
        userId: 5,
        review: "This spot was pretty lame",
        stars: 2
      },
      { spotId: 5, userId: 6, review: "This spot was pretty cool", stars: 4 },
      { spotId: 6, userId: 4, review: "This spot was pretty alright", stars: 2 },
      { spotId: 7, userId: 5, review: "Not impressed with this spot", stars: 2 },
      { spotId: 8, userId: 6, review: "Amazing experience at this spot", stars: 5 },
      { spotId: 9, userId: 1, review: "Decent spot, nothing special", stars: 3 },
      { spotId: 10, userId: 2, review: "Disappointing spot, wouldn't recommend", stars: 1 },
      { spotId: 1, userId: 6, review: "Interesting spot, worth checking out", stars: 4 },
      { spotId: 2, userId: 1, review: "Unique atmosphere at this spot", stars: 4 },
      { spotId: 3, userId: 2, review: "A hidden gem! Loved the ambiance", stars: 5 },
      { spotId: 4, userId: 3, review: "Not my favorite spot, but decent", stars: 3 },
      { spotId: 5, userId: 4, review: "Quaint spot with a cozy feel", stars: 4 },
      { spotId: 6, userId: 5, review: "Challenging to get to, but worth it", stars: 4 },
      { spotId: 7, userId: 6, review: "Another disappointing experience at this spot", stars: 2 },
      { spotId: 8, userId: 1, review: "Impressed once again by the wonders of this spot", stars: 5 },
      { spotId: 9, userId: 2, review: "Decent spot, but nothing extraordinary", stars: 3 },
      { spotId: 10, userId: 3, review: "Wouldn't recommend, didn't meet expectations", stars: 2 }
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
