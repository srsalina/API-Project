'use strict';
const { Spot } = require('../models')

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {

        ownerId: 1,
        address: "1234 Avenue Lane",
        city: "Burgertown",
        state: "California",
        country: "USA",
        lat: 23.456453,
        lng: 45.456433,
        name: "The burgeriest town around",
        description: "Wow! That was some burger!",
        price: 1500

      },
      {
        ownerId: 2,
        address: "5678 Turnaround Lane",
        city: "Spookville",
        state: "Georgia",
        country: "USA",
        lat: 34.65763,
        lng: 23.35521,
        name: "Scary house",
        description: "It's right behind me, isn't it?",
        price: 1000
      },
      {
        ownerId: 3,
        address: "921 George Street",
        city: "Bushtown",
        state: "Florida",
        country: "USA",
        lat: 64.23436,
        lng: 97.35622,
        name: "George W. Bush Summer Home",
        description: "That's just where he lives!",
        price: 5000
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      city: {
        [Op.in] : ["Burgertown","Spookville","Bushtown"]
      }
    })
  }
};
