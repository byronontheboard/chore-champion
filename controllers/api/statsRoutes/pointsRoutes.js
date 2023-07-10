const router = require('express').Router();
const { Task, User, Stats, CompletedTask } = require('../../../models');
const { Op } = require('sequelize');

// Get all points data
router.get('/all', async (req, res) => {
  try {
    const statsData = await Stats.findAll({
      order: [['total_points', 'DESC']],
      attributes: ['user_id', 'total_points']
    });

    if (!statsData) {
      res
        .status(400)
        .json({ message: 'No points data! Check back later.' });
      return;
    } else {
      return res.status(200).json(statsData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// get total points for specific user
router.get('/:id', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    
    const statsData = await Stats.findOne({
      where: {
        user_id,
      },
      attributes: ['total_points'],
    });

    return res.status(200).json(statsData.total_points);
    
  } catch (err) {
    res.status(400).json(err);
  }
  
});

// Get cumulative points to a specified date
// `/${user_id}/date/${encodeURIComponent(date.toISOString())}`
router.get('/:id/date/:date', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};
    
    const pointsData = await CompletedTask.findAll({
      where: {
        user_id,
        complete_date: {
          [Op.lt]: new Date(req.params.date)
        }
      },
      attributes: ['cumulative_points'],
      order: [['complete_date', 'DESC']],
      limit: 1
    });

    return res.status(200).json(pointsData.cumulative_points);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all points data after a specified date
router.get('/user/:id/after/:date', async (req, res) => {
  try {
    let user_id = req.params.id || req.session.user_id;
    if (user_id === 'me') {user_id = req.session.user_id};

    const pointsData = await CompletedTask.findAll({
      where: {
        user_id,
        complete_date: {
          [Op.gt]: req.params.date
        }
      },
      attributes: ['cumulative_points'],
      order: [['complete_date', 'DESC']]
    });

    return res.status(200).json(pointsData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;