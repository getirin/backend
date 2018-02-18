const mongoose = require('mongoose');
const { createMongooseEnumValidator } = require('../utils');
const { orderStatuses, carrierRequestStatuses } = require('../resources/model-constants');

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
  const orders = await this.find({ user }).sort({ createdAt: -1 }).exec();

  /**
   * TODO: optimize this bit, dont have the time to deal with the mongo query atm.
   */
  return Promise.all(orders.map(async (order) => {
    const carrier = await order.getCarrier().catch(() => undefined);

    if(carrier && carrier.name) order.carrier = { name: carrier.name };
    return order;
  }));
};

orderSchema.methods.getCarrier = async function(){
  if(![orderStatuses.OBTAINED, orderStatuses.FINISHED].includes(this.status)) {
    throw new Error('there would be no carrier for this kind of order.');
  }

  const carrierStatus = this.status === orderStatuses.OBTAINED
    ? carrierRequestStatuses.OBTAINED
    : carrierRequestStatuses.FINISHED;

  const cr = await this.model('CarrierRequest').find({ status: carrierStatus }).populate('carrier').exec();
  return cr[0].carrier;
};

module.exports = mongoose.model('Order', orderSchema);
