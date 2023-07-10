const router = require('express').Router();
const { Task, User, Stats, CompletedTask } = require('../../../models');
const { Op } = require('sequelize');

const completedRoutes = require('./completedRoutes');

router.use('/completed', completedRoutes);

// Get all stats data
router.get('/', async (req, res) => {
  try {
    const statsData = await Stats.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'id', 'email'] }
        }        
      ],
      order: [['total_points', 'DESC']],
      attributes: { exclude: ['createdAt']}
    });

    if (!statsData.length) {
      res
        .status(400)
        .json({ message: 'No stats! Check back later.' });
      return;
    } else {
      return res.status(200).json(statsData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// get stats for specific user
router.get('/:id', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    
    const statsData = await Stats.findOne({
      where: {
        user_id,
      },
      attributes: { exclude: ['id','user_id', 'createdAt'] },
    });

    if (!statsData) {
      res
        .status(400)
        .json({ message: 'No stats for that user! Check back later.' });
      return;
    } else {
      return res.status(200).json(statsData);
    }
    
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id/date/:date', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    

    const date = new Date(decodeURIComponent(req.params.date));

    const taskData = await CompletedTask.findAll({
      where: {
        user_id,
        complete_date: {
          [Op.lt]: date
        }
      },
      attributes: [
        [ 'cumulative_points', 'total_points' ],
        ['cumulative_minutes', 'total_minutes'],
        ['complete_date','updatedAt']
      ] ,
      order: [['complete_date', 'DESC']],
      limit: 1
    });

    
    if (!taskData.length) {
      res
        .status(400)
        .json({ message: 'No data for date '+ date.toLocaleString()});
      return;
    } else {
      return res.status(200).json(taskData[0]);
    }
    
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
