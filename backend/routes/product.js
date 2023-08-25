const router = require('express').Router();
const User = require('../models/user.model');
const Product = require('../models/product.model');

/* get all products */
router.route('/').get((req, res) => {
  Product.find()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).send(err.message));
});

/* create product */
router.route('/').post((req, res) => {
  const { name, description, price, category, images } = req.body;

  const newProduct = new Product({ name, description, price, category, images });

  newProduct
    .save()
    .then(product => {
      Product.find()
        .then(products => res.status(201).json(products))
        .catch(err => res.status(400).send(err.message));
    })
    .catch(err => res.status(400).send(err.message));
});

/* update product */
router.route('/:productID').patch((req, res) => {
  const { productID } = req.params;
  const { name, description, price, category, images } = req.body;

  Product.findByIdAndUpdate(productID, { name, description, price, category, images })
    .then(product => {
      Product.find()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).send(err.message));
    })
    .catch(err => res.status(400).send(err.message));
});

/* get a specific product alongside an array of similar products */
router.route('/:productID').get(async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findById(productID);
    const similarProducts = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similarProducts });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* delete product */
router.route('/:productID').delete(async (req, res) => {
  const { userID } = req.body;
  const { productID } = req.params;

  try {
    const user = await User.findById(userID);

    if (user.isAdmin) {
      await Product.findByIdAndDelete(productID);
      const updatedProducts = await Product.find();
      res.status(200).json(updatedProducts);
    } else {
      res.status(401).send('You are not authorized to carry out this operation');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get a specific category of products */
router.route('/category/:category').get(async (req, res) => {
  const { category } = req.params;

  try {
    let products;
    if (category === 'all') {
      products = await Product.find().sort([['date', -1]]);
    } else {
      products = await Product.find({ category });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* cart routes */
router.route('/add-to-cart').post(async (req, res) => {
  const { userID, productID, price } = req.body;

  try {
    const user = await User.findById(userID);
    const newUserCart = user.cart;
    const productInCart = user.cart[productID];

    if (productInCart) {
      newUserCart[productID] += 1;
    } else {
      newUserCart[productID] = 1;
    }
    newUserCart.totalItems += 1;
    newUserCart.totalPrice += Number(price);

    user.cart = newUserCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/remove-from-cart').post(async (req, res) => {
  const { userID, productID, price } = req.body;

  try {
    const user = await User.findById(userID);
    const newUserCart = user.cart;

    newUserCart.totalPrice -= newUserCart[productID] * Number(price);
    newUserCart.totalItems -= newUserCart[productID];
    delete newUserCart[productID];

    user.cart = newUserCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/increase-cart').post(async (req, res) => {
  const { userID, productID, price } = req.body;

  try {
    const user = await User.findById(userID);
    const newUserCart = user.cart;

    newUserCart.totalPrice += Number(price);
    newUserCart.totalItems += 1;
    newUserCart[productID] += 1;

    user.cart = newUserCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/decrease-cart').post(async (req, res) => {
  const { userID, productID, price } = req.body;

  try {
    const user = await User.findById(userID);
    const newUserCart = user.cart;

    newUserCart.totalPrice -= Number(price);
    newUserCart.totalItems -= 1;
    newUserCart[productID] -= 1;

    user.cart = newUserCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
