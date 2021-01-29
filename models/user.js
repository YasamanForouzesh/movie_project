'use strict';
const bcrypt=require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.comment)
      models.user.belongsToMany(models.movie,{through:'userMovieFave'})
    }
  };
  user.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'Name must be 2-25 characters long.'
        }
      }
    },
    dob: {
      type:DataTypes.DATEONLY,
      validate:{
        isDate:{
          msg:'please enter the valid date'
        }
      }
    },
    username: {
      type:DataTypes.STRING,
      unique:true
    },
    password: {
      type:DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters.'
        }
      }
    },
    description: DataTypes.TEXT,
    email: {
      type:DataTypes.STRING,
      isEmail:true
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  user.addHook('beforeCreate', (pendingUser, options)=>{
    console.log(`OG password: ${pendingUser.password}`)
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    console.log(`Hashed password: ${hashedPassword}`)
    pendingUser.password = hashedPassword
  })
  user.prototype.validPassword = async function(passwordInput) {
    let match = await bcrypt.compare(passwordInput, this.password)
    console.log("???????????match:", match)
    return match
  }
  return user;
};