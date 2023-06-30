const router = require('express').Router();
const { User, Task } = require('../models');
const withAuth = require('../utils/auth');
const knapsackWithItems = require('../utils/knapsack');

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

router.get('/task', withAuth, (req, res) => {
  // If a session exists, redirect the request to the homepage
  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  } else {
    res.render('task', {
      logged_in: req.session.logged_in
    });
  }
});

router.get('/browse', withAuth, async (req, res) => {
  try {
    const taskData = await Task.findAll({
      include: [
        {
          model: User
        }        
      ]
    });

    const tasks = taskData.map((project) => project.get({ plain: true }));
    console.log(tasks);
    res.render('browse', {
      tasks,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/knockoutSelect', async (req, res) => {
  res.render('knockoutSelect');
});

router.get('/knockout/:time', async (req, res) => {
  if (req.params.time) {
    try {
      const taskData = await Task.findAll({
        include: [
          {
            model: User
          }
        ],
        where: {
          user_id: req.session.user_id
        }
      });

      let minutes = [];
      let points = [];

      const timeLimit = req.params.time;

      const taskFilter = taskData.map((project) => project.get({ plain: true }));

      taskFilter.forEach(item => {
        minutes.push(item.minutes);
        points.push((1 / item.priority) * item.minutes);
      });
      
      const result = knapsackWithItems(minutes, points, +timeLimit);

      let tasks = [];

      for (let i = 0; i < taskFilter.length; i++) {
        for (let j = 0; j < result.selectedItems.length; j++) {
          if (i === result.selectedItems[j]) {
            console.log(i)
            tasks.push(taskFilter[result.selectedItems[j]]);
          }
        }
      }

      res.render('knockout', {
        time_limit: timeLimit,
        result,
        tasks,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    
  }
});

module.exports = router;
