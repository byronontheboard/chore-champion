const router = require('express').Router();
const { Task, User, Stats } = require('../../models');

const pointsRoutes = require('./pointsRoutes');
const completedRoutes = require('./completedRoutes');

router.use('/points', pointsRoutes);
router.use('/completed', completedRoutes);

// Get all stats data
router.get('/', async (req, res) => {
  try {
    const statsData = await Stats.findAll({
      order: [['total_points', 'DESC']],
    });

    if (!statsData) {
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
    const statsData = await Stats.findOne({
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

    return res.status(200).json(statsData);
    
  } catch (err) {
    res.status(400).json(err);
  }
});



module.exports = router;
