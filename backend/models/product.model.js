const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ImageSchema = new Schema(
  {
    url: String,
    public_id: String,
  },
  { _id: false, minimize: false, timestamps: false, versionKey: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: [true, 'cannot be blank'] },
    description: { type: String, required: [true, 'cannot be blank'] },
    price: { type: String, required: [true, 'cannot be blank'] },
    category: { type: String, required: [true, 'cannot be blank'] },
    images: { type: [ImageSchema], required: true },
  },
  { minimize: false, timestamps: true, collection: 'products' }
);

const Product = model('Product', ProductSchema);

module.exports = Product;
