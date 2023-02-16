const sequelize = require('../config/connection');
const { User, Recipe, Favorites} = require('../models');

const userData = require('./userData.json');
const recipeData = require('./recipieData.json');
const favoritesData = require('./favorites.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const recipies = await Recipe.bulkCreate(recipeData, {
    returning: true
  })

  const favorites = await Favorites.bulkCreate(favoritesData, {
    returning: true
  })

  process.exit(0);
};

seedDatabase();
