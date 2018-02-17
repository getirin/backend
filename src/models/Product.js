const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose);
const ProductJoiSchema = require('../schemas/models/Product');

const productSchema = new mongoose.Schema(Joigoose.convert(ProductJoiSchema), { timestamps: true });
productSchema.index({ name: 1 }, { unique: true });

/**
 * Given a list of ids, calculates the total price for the matched products.
 * @param ids
 * @return {Promise<number>}
 */
productSchema.statics.calculateTotalPriceOfProducts = async function(ids){
  return this.aggregate([
    { $match: { _id: { $in: ids.map(id => mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: null, totalPrice: { $sum: '$price' } } }
  ]).exec()
    .then(aggregate => {
      if(aggregate && aggregate.length > 0) return Promise.resolve(aggregate[0].totalPrice);
      return Promise.rejeect(new Error("Couldn't calculate the total price."));
    });
};

module.exports = mongoose.model('Product', productSchema);
