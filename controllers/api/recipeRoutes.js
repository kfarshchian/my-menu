const router = require('express').Router();
const { Recipe, Favorites } = require('../../models');
const withAuth = require('../../utils/auth');
const fs = require('fs');
const sequelize = require('../../config/connection');




router.post('/create_seeds', async (req, res) => {
  try {
    // console.log(req.body.recipies);
    await fs.writeFileSync('seeds/data.json', JSON.stringify(req.body.recipies), 'utf8');
    
    res.status(200).json({message: 'Success!'});
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newRecipe = await Recipe.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });

//     res.status(200).json(newRecipe);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });


// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const recipeData = await Recipe.destroy({
//       where: {
//         id: req.params.id,
//         user_id: req.session.user_id,
//       },
//     });

//     if (!recipeData) {
//       res.status(404).json({ message: 'No recipe found with this id!' });
//       return;
//     }

//     res.status(200).json(recipeData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/popular', async (req,res) => {
  // 
  try {
    const [favorites,favoriteMetadata] = await db.query('SELECT recipe_id, COUNT(*) AS "favorites" FROM diet_db.favorite GROUP BY recipe_id ORDER BY favorites DESC LIMIT 5')
    const favoriteRecipies = [];
    for(let i = 0; i < favorites.length; i++){
      const recipeId = favorites[i].recipe_id
      const recipe = await Recipe.findByPk(recipeId);
      // console.log(recipe.get({plain:true}));
      favoriteRecipies.push(recipe);
    }
    // console.log(favoriteRecipies);
    res.status(200).json({message: "Success!", favorites: favoriteRecipies});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
