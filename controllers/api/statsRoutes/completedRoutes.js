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
    const taskData = await CompletedTask.findAll({
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

    if (!taskData) {
      res
        .status(400)
        .json({ message: 'No tasks! Check back later.' });
      return;
    } else {
      return res.status(200).json(taskData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id/date/:date', async (req, res) => {
  try {
    const taskData = await CompletedTask.findOne({
      include: [
        {
          model: User
        }        
      ],
      where: {
        user_id: req.params.id,
        complete_date: {
          [Op.lt]: req.params.date
        }
      },
      attributes: { exclude: ['password', 'user_id'] },
      order: [['complete_date', 'DESC']],
      limit: 1
    });

    return res.status(200).json(taskData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all completed task data after a specified date
router.get('/:id/after/:date', async (req, res) => {
  try {
    const taskData = await CompletedTask.findAll({
      include: [
        {
          model: User
        }        
      ],
      where: {
        user_id: req.params.id,
        complete_date: {
          [Op.gt]: req.params.date
        }
      },
      attributes: { exclude: ['password', 'user_id'] },
      order: [['complete_date', 'DESC']]
    });

    return res.status(200).json(taskData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;