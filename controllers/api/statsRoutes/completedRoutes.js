const router = require('express').Router();
const { Task, User, Stats, CompletedTask } = require('../../../models');
const { Op } = require('sequelize');

// Get all completedTask data
router.get('/', async (req, res) => {
  try {
    const completedTaskData = await CompletedTask.findAll();

    if (!completedTaskData) {
      res
        .status(400)
        .json({ message: 'No completed tasks! Check back later.' });
      return;
    } else {
      return res.status(200).json(completedTaskData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all completed Task data for specified user
router.get('/user/:id', async (req, res) => {
  try {
    const completedTaskData = await CompletedTask.findAll({
      include: [
        {
          model: User
        }        
      ],
      where: {
        user_id: req.params.id
      },
      attributes: { exclude: ['password', 'user_id'] },
    });

    if (!completedTaskData) {
      res
        .status(400)
        .json({ message: 'No tasks! Check back later.' });
      return;
    } else {
      return res.status(200).json(completedTaskData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;