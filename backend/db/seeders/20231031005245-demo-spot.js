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
        name: "The burgeriest town around",
        description: "Wow! That was some burger!",
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
      },
      {
        ownerId: 4,
        address: "2469 Sunset Boulevard",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 38.54321,
        lng: 48.76543,
        name: "Random Sunset View Retreat",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 200
      },
      {
        ownerId: 5,
        address: "8727 Forest Haven Lane",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 58.87654,
        lng: 35.43210,
        name: "Random Enchanted Forest Cottage",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1600
      }, {
        ownerId: 6,
        address: "4329 Serenity Street",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 26.10987,
        lng: 51.87654,
        name: "Random Tranquil Retreat",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 700
      },
      {
        ownerId: 1,
        address: "1034 Harborview Drive",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 37.98765,
        lng: 22.10987,
        name: "Random Harborview Haven",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1300
      },
      {
        ownerId: 2,
        address: "3243 Skyline Terrace",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 39.65432,
        lng: 33.21098,
        name: "Random Skyline Sanctuary",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1150
      },
      {
        ownerId: 2,
        address: "3243 N Terrace",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 39.65432,
        lng: 33.21098,
        name: "Random Skyline Sanctuary",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        price: 1150
      },
      {
        ownerId: 3,
        address: "3243 S Terrace",
        city: "Random City",
        state: "Random State",
        country: "Random Country",
        lat: 39.65432,
        lng: 33.21098,
        name: "Random Skyline Sanctuary",
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
        [Op.in] : ["Burgertown","Spookville","Bushtown", "Random City"]
      }
    })
  }
};
