const router = require('express').Router();
const { User, Recipe, Favorites } = require('../../models');
// const withAuth = require('../../utils/userAuth');

//Create New user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//Log In User
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//logout user
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/favorites', async (req,res) => {
  try {
    const userData = await User.findByPk(req.session.user_id,{
      include: [{model: Recipe}]
    });
    const user = userData.get({plain: true});
    const favorites = user.recipes;
    // console.log(user);
    res.status(200).json(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.post('/favorites', async (req,res) => {
  try {
    if(!withAuth(req)){
      // console.log('here');
      res.redirect('/login');
      res.status(200);
      return;
    }
    // console.log(req.body);
    const recipeData = await Recipe.findOrCreate({
      where: {
        label: req.body.label,
        calories: req.body.calories
      },
      defaults: {
        ...req.body
      }
    })
    // console.log(recipeData[0].get({plain: true}));
    const recipe = recipeData[0].get({plain: true});
    // console.log(recipe)
    // console.log(recipe.id);
    const favorited = await Favorites.findOne({
      where: {
        user_id: req.session.user_id,
        recipe_id: recipe.id
      }
    });
    // console.log(favorited);
    if (favorited){
      // console.log()
      res.status(400).json({message: 'You have already favorited this'})
      return;
    }
    const newFavoriteData = await Favorites.create({
      user_id: req.session.user_id,
      recipe_id: recipe.id
    });
    const newFavorite = newFavoriteData.get({plain: true});
    // console.log(newFavorite);
    res.status(200).json({message: 'Success!' , newFavorite});
  } catch (err) {
    console.log(err);
    res.status(200).json(err);
  }
})

router.delete('/favorites', async (req,res) => {
  try {
    // console.log(req.body.recipe_id);
    const favorited = await Favorites.findOne({
      where: {
        user_id: req.session.user_id,
        recipe_id: req.body.recipe_id
      }
    });
    // console.log(favorited);

    if(!favorited){
      res.status(404).json({message: "None of this user's favorites match this recipe_id!"});
      return
    }
    const deletedFavorite = await Favorites.destroy({
      where: {
        user_id: req.session.user_id,
        recipe_id: req.body.recipe_id
      }
    })
    // console.log(deletedFavorite)
    res.status(200).json({message: 'Success!',deletedFavorite});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

function withAuth(req){
  if(!req.session.logged_in){
    return false;
  }
  return true;
}


module.exports = router;
