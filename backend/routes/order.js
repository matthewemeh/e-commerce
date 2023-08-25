const router = require('express').Router();
const User = require('../models/user.model');
const Order = require('../models/order.model');

/* create an order */
router.route('/').post(async (req, res) => {
  const io = req.app.get('socketio');
  const { userID, cart, country, address } = req.body;

  try {
    const user = await User.findById(userID);
    // create and save a new order...
    const order = await Order.create({
      country,
      address,
      products: cart,
      owner: user._id,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    });
    await order.save();

    // ...then empty user cart and update his/her orders
    user.cart = { totalPrice: 0, totalItems: 0 };
    user.orders.push(order);

    /* send notification of new order to admin */
    const notification = {
      status: 'unread',
      time: new Date(),
      message: `New order from ${user.name}`,
    };
    io.sockets.emit('new-order', notification);

    user.markModified('orders');
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get all orders */
router.route('/').get(async (req, res) => {
  try {
    const orders = await Order.find().populate('owner', ['email', 'name']);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* shipping order */
router.route('/:orderID/mark-shippped').patch(async (req, res) => {
  const { ownerID } = req.body;
  const { orderID } = req.params;
  const io = req.app.get('socketio');

  try {
    const user = await User.findById(ownerID);
    await Order.findByIdAndUpdate(orderID, { status: 'shipped' });
    const orders = await Order.find().populate('owner', ['email', 'name']);

    /* send notification of shipped order to user/client */
    const notification = {
      status: 'unread',
      time: new Date(),
      message: `Order ${orderID} shipped successfully`,
    };
    io.sockets.emit('notification', notification, ownerID);
    user.notifications.unshift(notification);
    await user.save();

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
