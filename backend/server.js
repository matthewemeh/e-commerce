const http = require('http');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const { connection } = mongoose;
connection.once('open', () => console.log('MongoDB database connection established successfully'));

const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const imageRoutes = require('./routes/image');
const productRoutes = require('./routes/product');

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);
app.use('/products', productRoutes);
app.use(express.urlencoded({ extended: true }));

app.post('/create-payment', (req, res) => {
  const { amount } = req.body;

  stripe.paymentIntents
    .create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    })
    .then(paymentIntent => res.status(200).json(paymentIntent))
    .catch(err => res.status(400).json(err.message));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

server.listen(port, () => console.log('Server running at port:', port));

app.set('socketio', io);
