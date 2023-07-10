const router = require('express').Router();
const { User, Task, NotTask } = require('../models');
const withAuth = require('../utils/auth');
const knapsackWithItems = require('../utils/knapsack');

// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
  try {

    const userData = await User.findByPk(req.session.user_id);

    res.render('homepage', {
      userData,
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

router.get('/profile', async (req, res) => {
  if (req.session.logged_in) {
    try {
      const userData = await User.findByPk(req.session.user_id);
      console.log(userData);
      res.render('profile', {
        userData,
        logged_in: req.session.logged_in
      });
    } catch(error) {
      console.log(error);
    }
  } else {
    res.render('create');
  }
});

router.get('/task', withAuth, async (req, res) => {
  // If a session exists, redirect the request to the homepage
  // const userData = await User.findByPk(req.session.user_id);

  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  } else {
    const userData = await User.findByPk(req.session.user_id);

    res.render('task', {
      logged_in: req.session.logged_in,
      userData
    });
  }
});

router.get('/task/:id', withAuth, async (req, res) => {
  // If a session exists, redirect the request to the homepage
  
  const taskId = req.params.id;
  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  } else {
    const userData = await User.findByPk(req.session.user_id);
    if (taskId) {
      const taskData = await Task.findByPk(taskId);
      console.log(taskData.due_date);
      if (taskData.user_id === req.session.user_id) {
        res.render('task', {
          logged_in: req.session.logged_in,
          userData,
          taskData,
          updateData: true
        });
      } else {
        res.status(404);
      }
    }
  }
});

router.get('/knockoutSelect', async (req, res) => {
  const userData = await User.findByPk(req.session.user_id);
  res.render('knockoutSelect', {
    userData,
    logged_in: req.session.logged_in,
  });
});

router.get('/knockout/:time', async (req, res) => {
  if (req.params.time) {
    console.log('req.params.time', req.params.time);
    var getAll;
    if (req.params.time == 'all') {
      getAll = true;
    }
    try {
      /*  Get all of the task data for this user. */
      const taskData = await Task.findAll({
        where: {
          user_id: req.session.user_id
        },
        order: [['priority', 'ASC'], ['points', 'DESC']]
      });

      /* Start the taskFilter. */
      const taskFilter = taskData.map((project) => project.get({ plain: true }));

      let minutesSum = 0;
      let pointsSum = 0;
      let minutes = [];
      let points = [];

      taskFilter.forEach(item => {
        minutes.push(item.minutes);
        points.push(item.points);
      });

      let useLength;
      let tasks;
      let time_limit = +req.params.time;
      if (getAll === true) {
        useLength = taskFilter.length;
        tasks = taskFilter;
      } else {
        tasks = [];
        const result = knapsackWithItems(minutes, points, +time_limit);
        useLength = result.length;
        for (let i = 0; i < taskFilter.length; i++) {
          for (let j = 0; j < result.selectedItems.length; j++) {
            if (i === result.selectedItems[j]) {
              tasks.push(taskFilter[result.selectedItems[j]]);
              minutesSum = minutesSum + taskFilter[result.selectedItems[j]].minutes;
              pointsSum = pointsSum + taskFilter[result.selectedItems[j]].points;
            }
          }
        }
      }
      /* Start the notTaskFilter */
      const notTaskData = await NotTask.findAll({
        order: [['priority', 'ASC']],
      });
      /* Start the notTaskFilter */
      const notTaskFilter = notTaskData.map((project) => project.get({ plain: true }));

      var notTasks;
      let notMinutes = [];
      let notPoints = [];
      var notMinutesSum = 0;
      if (getAll) {
        var notTimeLimit = 999999;
      } else {
        var notTimeLimit = (+req.params.time)*.5;
      }
      
      console.log('notTimeLimit', notTimeLimit);
      /* Push minutes and points into their own arrays for use in the knapsack function. */
      notTaskFilter.forEach(item => {
        notMinutes.push(item.minutes);
        /* This needs to be changed once notTasks actually have point values. */
        notPoints.push(100);
      });
      
      var notResult = knapsackWithItems(notMinutes, notPoints, +notTimeLimit);
      notTasks = [];
      if (notResult.selectedItems.length > 0) {
        
        
        for (let i = 0; i < notTaskFilter.length; i++) {
          for (let j = 0; j < notResult.selectedItems.length; j++) {
            if (i === notResult.selectedItems[j]) {
              notTasks.push(notTaskFilter[notResult.selectedItems[j]]);
              notMinutesSum = notMinutesSum + notTaskFilter[notResult.selectedItems[j]].minutes;
            }
          }
        }
      }

      var utilization = ((minutesSum/time_limit)*100).toFixed(1);
      var notUtilization = (((notMinutesSum)/time_limit)*100).toFixed(1);

      let taskLength = tasks.length;
      const userData = await User.findByPk(req.session.user_id);

      res.render('knockout', {
        time_limit: time_limit,
        notTimeLimit,
        utilization,
        notUtilization,
        minutesSum,
        pointsSum,
        notMinutesSum,
        notTasks,
        tasks,
        taskLength,
        getAll,
        userData,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
});


router.get('/trainingLog', async (req, res) => {
  const userData = await User.findByPk(req.session.user_id);

  res.render('trainingLog', {
    logged_in: req.session.logged_in,
    userData
  });
});

module.exports = router;
