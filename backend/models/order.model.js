const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const OrderSchema = new Schema(
  {
    products: Object,

    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    status: { type: String, default: 'processing' },

    totalPrice: { type: Number, default: 0 },

    totalItems: { type: Number, default: 0 },

    date: { type: String, default: new Date().toISOString().split('T')[0] },

    address: String,

    country: String,
  },
  { minimize: false, timestamps: true, collection: 'orders' }
);

const Order = model('Order', OrderSchema);

module.exports = Order;
