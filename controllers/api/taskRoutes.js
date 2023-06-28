const router = require('express').Router();
const { Task, User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    // Find the user who matches the tasked e-mail address
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
    // Find the user who matches the tasked e-mail address
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
    // Find the user who matches the tasked e-mail address
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
      due_date: req.body.due_date,
      user_id: req.session.user_id
    });
    res.status(200).json("Successfully created task.");
  } catch (err) {
    res.status(400).json(err);
  }
})
module.exports = router;
