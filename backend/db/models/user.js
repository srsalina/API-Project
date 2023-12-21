'use strict';
const { Model,Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {

      User.hasMany(models.Spot, {
        foreignKey: 'ownerId'
      })
      User.hasMany(models.booking, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Review, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate: {
        len: [4,30],
        isValidEmail(value){
          if(Validator.isEmail(value)) throw new Error('CANNOT BE AN EMAIL')
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate: {
        len: [3,256],
        isEmail:true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [60,60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword','email','createdAt','updatedAt']
      }
    }
  });
  return User;
};
