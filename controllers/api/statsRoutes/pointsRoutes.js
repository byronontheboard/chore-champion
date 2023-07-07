const router = require('express').Router();
const { Task, User, Stats } = require('../../models');

// Get all points data
router.get('/', async (req, res) => {
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
    const statsData = await Stats.findOne({
      include: [
        {
          model: User
        }        
      ],
      where: {
        user_id: req.params.id
      },
      attributes: ['total_points'],
    });

    return res.status(200).json(statsData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});



module.exports = router;