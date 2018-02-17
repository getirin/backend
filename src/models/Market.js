const mongoose = require('mongoose');
const { createNearGeoQuery } = require('../utils');

const marketSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: [Number], index: '2dsphere' },
}, { timestamps: true });

marketSchema.index({ name: 1 }, { unique: true });

marketSchema.statics.nearbyOfLocation = async function(location, $maxDistance, $minDistance){
  return this.find({ location: createNearGeoQuery(location, $maxDistance, $minDistance) }).exec();
};

module.exports = mongoose.model('Market', marketSchema);
