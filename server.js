const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const connect = require('./mongodb.js');
const axios = require('axios');

const swaggerInit = require('./swagger/swaggerInit.js');

connect();

const Product = mongoose.model('Product', {
  name: String,
  price: Number,
});

const User = mongoose.model('User', {
  name: String,
  email: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Order = mongoose.model('Order', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const app = express();
app.use(bodyParser.json());

swaggerInit(app);

// GET all orders and their products
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products').populate('userId');
    res.json(orders);
  } catch (err) {
    console.log(err.message);
  }
});

// GET a specific order by ID and its products
app.get('/order/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate('products')
      .populate('userId');
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

// GET all orders for a specific user
app.get('/orders/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .populate('products')
      .populate('userId');
    res.json(orders);
  } catch (err) {
    console.log(err.message);
  }
});

// POST a new order
app.post('/order', async (req, res) => {
  try {
    const { userId, productIds } = req.body;
    const order = new Order({ userId, products: productIds });
    await order.save();
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

// DELETE an order by ID
app.delete('/order/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Orders service running on port ${PORT}`));
