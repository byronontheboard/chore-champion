const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const users = userData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      users,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/create', (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('create');
});

router.get('/post', withAuth, (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  } else {
    res.render('post', {
      logged_in: req.session.logged_in
    });
  }
});

router.get('/browse', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User
        }        
      ]
    });

    const posts = postData.map((project) => project.get({ plain: true }));
    console.log(posts);
    res.render('browse', {
      posts
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
