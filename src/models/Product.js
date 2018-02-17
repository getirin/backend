const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose);
const ProductJoiSchema = require('../schemas/models/Product');

const productSchema = new mongoose.Schema(Joigoose.convert(ProductJoiSchema), { timestamps: true });
productSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
