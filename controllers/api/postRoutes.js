const router = require('express').Router();
const { Post, User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const postData = await Post.findAll();

    if (!postData) {
      res
        .status(400)
        .json({ message: 'No posts! Check back later.' });
      return;
    } else {
      return res.status(200).json(postData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const postData = await Post.findByPk(req.params.id);

    if (!postData) {
      res
        .status(400)
        .json({ message: 'No posts! Check back later.' });
      return;
    } else {
      return res.status(200).json(postData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const postData = await Post.findAll({
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

    if (!postData) {
      res
        .status(400)
        .json({ message: 'No posts! Check back later.' });
      return;
    } else {
      return res.status(200).json(postData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/create', async (req, res) => {
   try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.body,
      user_id: req.session.user_id
    });
    res.status(200).json("Successfully created post.");
  } catch (err) {
    res.status(400).json(err);
  }
})
module.exports = router;
