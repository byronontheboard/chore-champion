const router = require('express').Router();
const { Task, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { Op } = require('sequelize');

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

// Get all tasks for a user
// Optional query parameters "filter", "after", and "before"
// "filter" can be either "complete" or "incomplete", to get only completed or incomplete tasks.
// "after" and "before" are dates.
router.get('/user/:id', async (req, res) => {

  let where = {user_id: req.params.id}

  switch (req.query.filter) {
    case 'complete':
      where.complete_date = {[Op.not]: null}
      break;
    case 'incomplete':
      where.complete_date = null
      break;
  }

  const dueAfter = req.query.dueAfter ? new Date(req.query.dueAfter) : undefined;
  const dueBefore = req.query.dueBefore ? new Date(req.query.dueBefore) : undefined;
  const createdAfter = req.query.createdAfter ? new Date(req.query.createdAfter) : undefined;
  const createdBefore = req.query.createdBefore ? new Date(req.query.createdBefore) : undefined;

  if (dueAfter && dueBefore) {
    if (dueBefore <= dueAfter) {
      res
        .status(400)
        .json({ message: 'Make sure the dueBefore date is later than the dueAfter date.' });
      return;
    }
    where.due_date = {
      [Op.between]: [dueAfter, dueBefore]
    }
  } else if (dueAfter) {
    where.due_date = {
      [Op.gte]: dueAfter
    }
  } else if (dueBefore) {
    where.due_date = {
      [Op.lte]: dueBefore
    }
  }

  if (createdAfter && createdBefore) {
    if (createdBefore <= createdAfter) {
      res
        .status(400)
        .json({ message: 'Make sure the createdBefore date is later than the createdAfter date.' });
      return;
    }
    where.createdAt = {
      [Op.between]: [createdAfter, createdBefore]
    }
  } else if (createdAfter) {
    where.createdAt = {
      [Op.gte]: createdAfter
    }
  } else if (createdBefore) {
    where.createdAt = {
      [Op.lte]: createdBefore
    }
  }

  try {
    const taskData = await Task.findAll({
      include: [
        {
          model: User
        }        
      ],
      where,
      attributes: { exclude: ['password', 'user_id'] },
    });

    if (!taskData) {
      res
        .status(400)
        .json({ message: 'No tasks with those criteria! Check back later.' });
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

router.put(':id', async (req, res) => {
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

  } catch (err) {
    res.status(400).json(err);
  }
})

// Special update route to toggle a task.
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

// Special update route to snooze a task.
router.put('/snooze/:id/', withAuth, async (req, res) => {
  let days = req.query.days || 0;
  let hours = req.query.hours || 0;
  let minutes = req.query.minutes || 0;

  // default snooze 1 day
  // but maybe someone wants to snooze for 0 time??
  // if (days+hours+minutes === 0) {days = 1};

  try {
    const task_id = req.params.id;
    const taskToUpdate = await Task.findByPk(task_id);

    let dueDate = new Date(taskToUpdate.due_date);
    dueDate.setDate(dueDate.getDate() + days);
    dueDate.setHours(dueDate.getHours() + hours);
    dueDate.setMinutes(dueDate.getMinutes() + minutes);

    taskToUpdate.due_date = dueDate;

    await taskToUpdate.save();
    res.json(taskToUpdate);

  } catch (err) {
    res.status(400).json(err);
  }
})


module.exports = router;
