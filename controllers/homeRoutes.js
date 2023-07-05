const router = require('express').Router();
const { User, Task, NotTask } = require('../models');
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
  res.render('knockoutSelect', {
    logged_in: req.session.logged_in,
  });
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
        },
        order: [['priority', 'ASC'], ['points', 'DESC']]
      });
      
      let minutes = [];
      let points = [];

      const time_limit = +req.params.time;

      const taskFilter = taskData.map((project) => project.get({ plain: true }));

      taskFilter.forEach(item => {
        minutes.push(item.minutes);
        points.push(item.points);
      });
      
      const result = knapsackWithItems(minutes, points, +time_limit);
      
      let tasks = [];
      let minutesSum = 0;
      let pointsSum = 0;

      for (let i = 0; i < taskFilter.length; i++) {
        for (let j = 0; j < result.selectedItems.length; j++) {
          if (i === result.selectedItems[j]) {
            tasks.push(taskFilter[result.selectedItems[j]]);
            minutesSum = minutesSum + taskFilter[result.selectedItems[j]].minutes;
            pointsSum = pointsSum + taskFilter[result.selectedItems[j]].points;
          }
        }
      }
      var notResult;
      var notTasks;
      var notTimeLimit;
      // This might break things.
      const notTaskData = await NotTask.findAll({
        order: [['priority', 'ASC']],
      });
      // console.log(notTaskData);
      var notResult;
      let notMinutes = [];
      let notPoints = [];
      var notMinutesSum = 0;
      if (notTaskData) {
        notTimeLimit = (+req.params.time)*.5;
        const notTaskFilter = notTaskData.map((project) => project.get({ plain: true }));

        notTaskFilter.forEach(item => {
          notMinutes.push(item.minutes);
          notPoints.push(1/item.priority);
        });
        
        notResult = knapsackWithItems(notMinutes, notPoints, +notTimeLimit);
        console.log(notTaskFilter);
        console.log(notMinutes);
        console.log(notPoints);
        console.log(notResult);
        if (notResult.selectedItems.length > 0) {
          notTasks = [];
          
          for (let i = 0; i < notTaskFilter.length; i++) {
            for (let j = 0; j < notResult.selectedItems.length; j++) {
              if (i === notResult.selectedItems[j]) {
                notTasks.push(notTaskFilter[notResult.selectedItems[j]]);
                notMinutesSum = notMinutesSum + notTaskFilter[notResult.selectedItems[j]].minutes;
              }
            }
          }
        }
      }

      var utilization = ((minutesSum/time_limit)*100).toFixed(1);
      var notUtilization = (((notMinutesSum)/time_limit)*100).toFixed(1);

      console.log(notTasks);

      res.render('knockout', {
        time_limit: time_limit,
        notTimeLimit,
        utilization,
        notUtilization,
        minutesSum,
        pointsSum,
        notMinutesSum,
        result,
        notTasks,
        tasks,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    
  }
});


router.get('/trainingLog', async (req, res) => {
  res.render('trainingLog', {
    logged_in: req.session.logged_in,
  });
});
module.exports = router;
