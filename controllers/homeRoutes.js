const router = require('express').Router();
const { Recipe, User } = require('../models');
const withAuth = require('../utils/auth');
// const $ = require('jquery');
// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );

//Renders Home Page
router.get('/', async (req, res) => {
  try {
    //Render the homepage through homepage handle bar
    res.render('homepage', {
      logged_in: req.session.logged_in
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/search', async (req, res) => {
  try {
    // console.log(req.body.recipies);
    // const searchResults = JSON.parse(window.localStorage.getItem('search_results'));
    // console.log(searchResults);
    res.render('search', {
      logged_in: req.session.logged_in
    })

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// router.post('/search', async (req, res) => {
//   try {
//     console.log(req.body.recipies);
//     const recipies = req.body.recipies;
//     // res.render('profile');
//     res.render('search', {
//       // recipies: "hello",
//       test: 'hello',
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    // const userData = await User.findByPk(req.session.user_id, {
    //   attributes: { exclude: ['password'] },
    // });

    // const user = userData.get({ plain: true });

    const userData = await User.findByPk(req.session.user_id,{
      include: [{model: Recipe}]
    });
    const user = userData.get({plain: true});
    const favorites = user.recipes;
    console.log(favorites)

    res.render('profile', {
      recipies: favorites,
      logged_in: req.session.logged_in
    });
    // res.status(200).json({message: 'Success!'})
  } catch (err) {
    res.status(500).json(err);
  }
});

//load the login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

//load the signup page
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('signup');
});

router.get('/image', async (req,res) => {
  const image = await fetch('https://edamam-product-images.s3.amazonaws.com/web-img/e42/e42f9119813e890af34c259785ae1cfb.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDwGpA%2BAuUI2ZzsOBVciaLV8N98YNk1bjffa2L1YA7rgwIhAKOzxdUd3xNGm%2FoUJlom5Vv0X6yhOAa1VpP8twOdrKAkKswECDUQABoMMTg3MDE3MTUwOTg2IgzTFJEsiXtpKq%2FWYgcqqQTQ7D%2BEJBKW6vkg7b%2BfmvrVWPNQDYCuH%2BXR3r4%2F9JsA1aFqpwyLygD3YqS2zwONafRTWc8g0W9NIlzJHeylF6JEZ1BVvRXTiH%2Faus5VPggGLnpl2J9hqUa%2FSQ%2BgcFX5jH7h3lRm7E2Ukm1llfYNqXEOy%2FR64jOM9ywVUsuki49lkqcnZ%2BeK7lt7e5k9U4%2BA843HU3GYRgUcaA5d59Ia%2FtLTxfKUBM%2FMb9uQDxIALABkZdKKeJ0fHnzjfhpZt5Ly1gqjG8gygoElJ2sOXv9QFLv7wTCRX2PRPc3wyXwhCsBTSGxu3rSZ%2BFU8oINUZ3rdtRZFvdMIZpW8oiWCvdF3fqnVBt2VhNxfrNYl0bVmd2PoCizdIioRGIY%2B%2BczjAj%2B2thnFRVcunC1CunFylKjjeThICv8PXfzBxqII35rej06GQL7%2B%2Fn9Vv0XHEFsm41sZ523wvfCZCjIPLUqJ1tRCah4ZzeLvnjUbtAU342w3yZb3XTIUEm27E5OL03O7cgJxtOp0nC00kai8UePXXpodTp9gki2BjNs1GGLlKusvVC0eEs9cMAF09IjMxD3FpUlelDSAJptFbDKXLDmYCvZSqRxbqM8mARYIDIqjBSS%2F6lKDJ6%2Fmg1irFYQLtCgV2OOW%2F2WlophyxwwDtLa1bk2nUcQO5rrqNMEBT35CmOIi9laDcwoArF566MdpVO%2FF4cSvqxl4UZ0kqWR%2BtoxmY2vmN9VTU6cpdq3s7ECZMJzxtJ8GOqgBFtLTG8rxt55tQsqGb023WzhLamHNrzKhZ4LD%2BCrsQsMYlgPKUYw0Wuowtc9qrsBqvGzGHSITnco2nVkd7et%2BSZxo74v15ik7Ebkptp%2FLUW1V%2FQbZbB2n9inkX9aqUFHka6ec7c3gXt9NDBxIqBBjmzdY2lqBN%2Fim2iZac233R9bpatddEeE9vKe87Jvh5s3bexcfalV3GFy1cbhBkdsYQkBv%2FaewpDwo&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230215T202205Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFNRX5H7QM%2F20230215%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8c85cc8b0d935aadc86e853e4e2a200022499eb3608be13dc7060206ef472dc7',{
    method: 'GET',
    headers: { 'Content-Type': 'image/png' }
  });
  console.log(image);
  res.status(200).send(image)
});

module.exports = router;
