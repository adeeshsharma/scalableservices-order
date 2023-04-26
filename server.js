const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const connect = require('./mongodb.js');

connect();

const Order = mongoose.model('Order', {
  userId: String,
  productId: String,
});

const app = express();
app.use(bodyParser.json());

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/order/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

app.post('/order', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const order = new Order({ userId, productId });
    await order.save();
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

app.put('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { userId, productId },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete('/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Orders service running on port ${PORT}`));
