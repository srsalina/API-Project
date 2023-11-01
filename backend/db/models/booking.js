'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })
      booking.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  booking.init({
    spotId: {
      type: DataTypes.INTEGER,
        allowNull:false,
        onDelete:'CASCADE'
    },
    userId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      allowNull:false},
    endDate: {
      type: DataTypes.DATE,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'booking',
  });
  return booking;
};
