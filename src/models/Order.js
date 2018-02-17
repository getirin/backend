const mongoose = require('mongoose');
const { createMongooseEnumValidator } = require('../utils');
const { orderStatuses } = require('../resources/model-constants');

const orderSchema = new mongoose.Schema({
  title: { type: String },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    count: { type: Number },
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalPrice: { type: Number },
  address: { type: Object },
  destination: { type: [Number], index: '2dsphere' },
  status: { type: Number, validate: createMongooseEnumValidator(Object.values(orderStatuses), 'Order status invalid!') }
}, { timestamps: true });

orderSchema.statics.listUserOrders = async function(user){
  return this.find({ user }).sort({ createdAt: -1 }).exec();
};

module.exports = mongoose.model('Order', orderSchema);
