const User = require('./User');
const Recipe = require('./Recipe');
const Favorites = require('./Favorites')

User.belongsToMany(Recipe, {through: Favorites})

Recipe.belongsToMany(User, {through: Favorites});

Recipe.hasMany(Favorites,{
    foreignKey: 'recipe_id',
    onDelete: 'CASCADE'
})

Favorites.belongsTo(Recipe,{
    foreignKey: 'recipe_id'
})

module.exports = { User, Recipe, Favorites };
