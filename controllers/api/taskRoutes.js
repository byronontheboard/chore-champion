const router = require('express').Router();
const { Task, User, Stats } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const taskData = await Task.findAll();

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

router.get('/:id', async (req, res) => {
  try {
    const taskData = await Task.findByPk(req.params.id);

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

router.get('/user/:id', async (req, res) => {
  try {
    const taskData = await Task.findAll({
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

router.post('/create', async (req, res) => {
   try {
    const newTask = await Task.create({
      title: req.body.title,
      body: req.body.body,
      due_date: new Date(req.body.due_date),
      priority: req.body.priority,
      points: req.body.points,
      user_id: req.session.user_id
    });
    res.status(200).json("Successfully created task.");
  } catch (err) {
    res.status(400).json(err);
  }
})

router.delete(':id', async (req, res) => {
  try {
    const task_id = req.params.id;
    const taskToDelete = await Task.findByPk(task_id);
    const taskTitle = taskToDelete.title;

    if (req.session.user_id !== taskToDelete.user_id) {
      res
        .status(400)
        .json({ message: 'You can only delete your own tasks.' });
      return;
    }

    const deletedRows = await Task.destroy({
      where: {
        id: task_id,
      },
    });
    
    if (deletedRows > 0) {
      res.status(200).json(`Task "${taskTitle}" deleted successfully`);
    } else {
      res.status(400).json(`Task with ID ${task_id} not found`);
    }
  } catch (err) {
    res.status(400).json(err);
  }
})

router.put(':id', async (req, res) => {
  try {
    const task_id = req.params.id;
    const taskToUpdate = await Task.findByPk(task_id);

    if (req.session.user_id !== taskToDelete.user_id) {
      res
        .status(400)
        .json({ message: 'You can only update your own tasks.' });
      return;
    }

    taskToUpdate.set({
      title: req.body.title || taskToUpdate.title,
      body: req.body.body || taskToUpdate.body,
      due_date: new Date(req.body.due_date) || taskToUpdate.due_date,
      priority: req.body.priority || taskToUpdate.priority,
      points: req.body.points || taskToUpdate.points,
    })
    
    taskToUpdate.save();

  } catch (err) {
    res.status(400).json(err);
  }
})

router.put('/:id/complete', async (req, res) => {
  try {
    const task_id = req.params.id;
    const taskToUpdate = await Task.findByPk(task_id);

    if (req.session.user_id !== taskToDelete.user_id) {
      res
        .status(400)
        .json({ message: 'You can only update your own tasks.' });
      return;
    }
    // Set complete_date to current date
    taskToUpdate.complete_date = new Date();
    
    taskToUpdate.save();

    // Update user's total points
    const statsData = await Stats.findOne({
      include: [
        {
          model: User
        }        
      ],
      where: {
        user_id: req.session.user_id
      },
      attributes: { exclude: ['password', 'user_id'] },
    });

    statsData.total_points += taskToUpdate.points;

    statsData.save();

  } catch (err) {
    res.status(400).json(err);
  }
})


module.exports = router;
