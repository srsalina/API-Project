'use strict';
const { Model,Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {

    }
  }
  User.init({
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
