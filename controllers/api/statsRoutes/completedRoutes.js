const router = require('express').Router();
const { Task, User, Stats, CompletedTask } = require('../../../models');
const { Op } = require('sequelize');

// // Get all completedTask data
// router.get('/', async (req, res) => {
//   try {
//     const completedTaskData = await CompletedTask.findAll();

//     if (!completedTaskData) {
//       res
//         .status(400)
//         .json({ message: 'No completed tasks! Check back later.' });
//       return;
//     } else {
//       return res.status(200).json(completedTaskData);
//     }
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// get all completed Task data for specified user
router.get('/:id', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    
    const taskData = await CompletedTask.findAll({
      where: {
        user_id,
      },
      attributes: { exclude: ['id','user_id'] },
      order: [['complete_date', 'DESC']],
    });

    if (!taskData.length) {
      res
        .status(400)
        .json({ message: 'No completed tasks! Check back later.' });
      return;
    } else {
      return res.status(200).json(taskData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});



// get all completed task data after a specified date
router.get('/:id/date/:date', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    
    const taskData = await CompletedTask.findAll({
      where: {
        user_id,
        complete_date: {
          [Op.gt]: new Date(decodeURIComponent(req.params.date))
        }
      },
      attributes: { exclude: ['id','user_id'] },
      order: [['complete_date', 'DESC']]
    });

    if (!taskData.length) {
      res
        .status(400)
        .json({ message: 'No completed tasks! Check back later.' });
      return;
    } else {
      return res.status(200).json(taskData);
    }
  } catch (err) {
    res.status(400).json(err);
    
  } 
});

module.exports = router;