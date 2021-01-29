'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.movie.hasMany(models.comment)
      models.movie.belongsToMany(models.user,{through:'userMovieFave'})
    }
  };
  movie.init({
    title: DataTypes.STRING,
    imdb: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};