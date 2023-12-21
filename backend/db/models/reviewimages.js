'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviewImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reviewImages.belongsTo(models.Review, {
        foreignKey: 'reviewId'
      })
    }
  }
  reviewImages.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      onDelete:'CASCADE',
      hooks:true
    },
    url: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'reviewImages',
  });
  return reviewImages;
};
