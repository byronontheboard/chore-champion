const router = require('express').Router();
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const statsRoutes = require('./statsRoutes');

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
