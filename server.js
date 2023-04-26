const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const connect = require('./mongodb.js');

const swaggerInit = require('./swagger/swaggerInit.js');

connect();

const Order = mongoose.model('Order', {
  userId: String,
  productId: String,
});

const app = express();
app.use(bodyParser.json());

swaggerInit(app);

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/order/:idToGet', async (req, res) => {
  try {
    const id = req.params.idToGet;
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

app.put('/order/:idToUpdate', async (req, res) => {
  try {
    const { idToUpdate } = req.params;
    const { userId, productId } = req.body;
    const order = await Order.findByIdAndUpdate(
      idToUpdate,
      { userId, productId },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete('/order/:idToDelete', async (req, res) => {
  try {
    const { idToDelete } = req.params;
    await Order.findByIdAndDelete(idToDelete);
    res.sendStatus(204);
  } catch (err) {
    console.log(err.message);
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Orders service running on port ${PORT}`));
