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
        review: "President Bush was a great host! Guy can really make pancakes WOW.",
        stars: 5,

      },
      {
        spotId: 1,
        userId: 2,
        review: "Amazing experience. Beautiful home and responsive host. Don't know who was screaming the whole time though. Every night at 3AM. Weird...",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "It was ok. There's a ghost that inhabits this place but only hangs around the kitchen area. We were all too scared to cook anything and ate raw fish and drank sea water every day. Host also never answerd our messages. Typical.",
        stars: 3
      },
      { spotId: 4,
        userId: 5,
        review: "This spot was pretty lame. The alligators kept stealing our food.",
        stars: 2
      },
      { spotId: 5, userId: 6, review: "BRO THIS PLACE WAS DOPE!!", stars: 4 },
      { spotId: 6, userId: 4, review: "Everything was going well until we realized that the host did not fill the ship with fuel. Lost at sea for about 79 hours. Unresponsive host. A previous guest was a stowaway in the bathroom. Terrible experience", stars: 2 },
      { spotId: 7, userId: 5, review: "Not impressed with this spot. The location was way too big. I lost my dog here and never found her. Host was terrible, told me to call his HR department. Number was just the pizza hut delivery line. Never returning here again.", stars: 1 },
      { spotId: 8, userId: 6, review: "Amazing experience at this wonderful home!", stars: 5 },
      { spotId: 9, userId: 1, review: "Was nice to see how the poor can make such beautiful homes.", stars: 3 },
      { spotId: 10, userId: 2, review: "Disappointing spot, wouldn't recommend. Too many stairs. Very, very small on the inside. Like extremely cramped.", stars: 1 },
      { spotId: 1, userId: 6, review: "Interesting spot, worth checking out. Very beautiful if you can get past the homeless crazy man that sneaks into the neighborhood every night to scream at the palm trees.", stars: 4 },
      { spotId: 2, userId: 1, review: "Unique atmosphere at this spot. Not super scary.", stars: 4 },
      { spotId: 3, userId: 2, review: "Beautiful home by the ocea. Absolutely love the Dick Cheney portrait in the bathroom.", stars: 5 },
      { spotId: 4, userId: 3, review: "Not the best spot on the swamp.", stars: 3 },
      { spotId: 5, userId: 4, review: "Quaint little spot with a cozy feel. Lovely little home.", stars: 4 },
      { spotId: 6, userId: 5, review: "Challenging to get to, but worth it", stars: 4 },
      { spotId: 7, userId: 6, review: `Another disappointing experience at this spot. It's so beautiful but the host is so weird. Whenever he wasn't hiding underneath the table he would just be swimming circles around the island screaming "WHOS THE MAN" for the entire duration of the stay. `, stars: 2 },
      { spotId: 8, userId: 1, review: "Amazing location. Host was very kind. Did not charge us for exploding the dryer", stars: 5 },
      { spotId: 9, userId: 2, review: "Not the cleanest spot but still very nice concept for a home.", stars: 3 },
      { spotId: 10, userId: 3, review: "Somehow extremely small once inside. Host swore at us thinking we were breaking in when we checked in. She also cooked us breakfast but forgot she did so and yelled at us when we ate it. Strange experience. ", stars: 2 }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      stars: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
