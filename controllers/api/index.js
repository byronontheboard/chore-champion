const router = require('express').Router();
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const statsRoutes = require('./statsRoutes');

const withAuth = require('../../utils/auth');

router.use('/users', userRoutes);
router.use('/tasks', withAuth, taskRoutes);
router.use('/stats', withAuth, statsRoutes);

module.exports = router;
