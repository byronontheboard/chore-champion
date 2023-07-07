const router = require('express').Router();
const { Task, User } = require('../../models');
const withAuth = require('../../utils/auth');

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

router.post('/', async (req, res) => {
   try {
    // var due_date;
    // if (req.body.due_date = '') {
    //   due_date = null;
    // } else {
    //   due_date = new Date(req.body.due_date);
    // }
    // console.log(due_date);
    const newTask = await Task.create({
      title: req.body.title,
      body: req.body.body,
      due_date: req.body.due_date,
      priority: req.body.priority,
      points: req.body.points,
      minutes: req.body.minutes,
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

router.put('/:id', async (req, res) => {
  try {
    const task_id = req.params.id;
    const taskToUpdate = await Task.findByPk(task_id);

    if (req.session.user_id !== taskToUpdate.user_id) {
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
      minutes: req.body.minutes || taskToUpdate.minutes,
    })
    
    taskToUpdate.save();
    res.status(200).json("Success.");
  } catch (err) {
    res.status(400).json(err);
  }
})

// Special update route to toggle a tak.
router.put('/complete/:id', withAuth, async (req, res) => {
  try {
    const task_id = req.params.id;
    const taskToUpdate = await Task.findByPk(task_id);

    if (+req.session.user_id !== +taskToUpdate.user_id) {
      console.log(req.session.user_id,taskToUpdate.user_id )
      res
        .status(400)
        .json({ message: 'You can only update your own tasks.'+req.session.user_id });
      return;
    }

    // Toggle completion state
    if (taskToUpdate.complete_date) {
      taskToUpdate.complete_date = null;
    } else {
      taskToUpdate.complete_date = new Date();
    }

    // the user's total points are updated in the models' hooks.

    await taskToUpdate.save();
    res.json(taskToUpdate);

  } catch (err) {
    res.status(400).json(err);
  }
})


module.exports = router;
