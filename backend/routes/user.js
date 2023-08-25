const router = require('express').Router();
const User = require('../models/user.model');

/* signup */
router.route('/signup').post((req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({ name, email, password });

  newUser
    .save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).send(err.message));
});

/* login */
router.route('/login').post((req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then(user => res.json(user))
    .catch(err => res.status(400).send(err.message));
});

/* get all users */
router.route('/').get((req, res) => {
  User.find({ isAdmin: false })
    .populate('orders')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).send(err.message));
});

/* get specific user */
router.route('/:userID').get((req, res) => {
  const { userID } = req.params;

  User.findById(userID)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).send(err.message));
});

/* get specific user's orders */
router.route('/:userID/orders').get(async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID).populate('orders');
    res.status(200).json(user.orders);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update user notifications */
router.route('/:userID/update-notifications').post(async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);
    user.notifications.forEach(notification => {
      notification.status = 'read';
    });
    user.markModified('notifications');
    await user.save();

    res.status(200).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
