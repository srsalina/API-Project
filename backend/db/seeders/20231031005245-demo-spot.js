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
        city: "Catalina Island",
        state: "California",
        country: "USA",
        lat: 23.456453,
        lng: 45.456433,
        name: "Wonderful tinyhome right on the docks! Pets welcome!",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1500

      },
      {
        ownerId: 2,
        address: "5678 Turnaround Lane",
        city: "West Keys",
        state: "Florida",
        country: "USA",
        lat: 34.65763,
        lng: 23.35521,
        name: "Scary house",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 5000
      },
      {
        ownerId: 4,
        address: "2469 Sunset Boulevard",
        city: "Seattle",
        state: "Washington",
        country: "USA",
        lat: 38.54321,
        lng: 48.76543,
        name: "Random Sunset View Retreat",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 200
      },
      {
        ownerId: 5,
        address: "8727 Ocean Haven Lane",
        city: "Oceanside",
        state: "California",
        country: "USA",
        lat: 58.87654,
        lng: 35.43210,
        name: "Beautiful seaside mansion on a cliff.",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1600
      }, {
        ownerId: 6,
        address: "4329 Serenity Street",
        city: "Catalina Island",
        state: "California",
        country: "USA",
        lat: 26.10987,
        lng: 51.87654,
        name: "5 Bedroom Yacht, Perfect for stowaways.",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 700
      },
      {
        ownerId: 1,
        address: "1034 Harborview Drive",
        city: "Miami",
        state: "Florida",
        country: "USA",
        lat: 37.98765,
        lng: 22.10987,
        name: "Beautiful Island Home. Pet UNFRIENDLY.",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1300
      },
      {
        ownerId: 2,
        address: "3243 WaterFront Terrace",
        city: "San Jose",
        state: "Puerto Rico",
        country: "USA",
        lat: 39.65432,
        lng: 33.21098,
        name: "Water Front Sanctuary",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1150
      },
      {
        ownerId: 2,
        address: "3243 N Swamp",
        city: "Okefenoke",
        state: "Georgia",
        country: "USA",
        lat: 39.65432,
        lng: 33.21098,
        name: "Its on the river!",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1150
      },
      {
        ownerId: 3,
        address: "3243 S Cliff",
        city: "Clifftown",
        state: "California",
        country: "USA",
        lat: 39.65432,
        lng: 33.21098,
        name: "ENORMOUS home on the inside",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1150
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';

    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      city: {
        [Op.in] : ["Catalina Island","West Keys","Bushtown", "Seattle","Oceanside","Miami" ,"San Jose","Okefenoke","Clifftown"]
      }
    })
  }
};
