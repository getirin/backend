const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: [Number], index: '2dsphere' },
}, { timestamps: true });

marketSchema.index({ name: 1 }, { unique: true });

marketSchema.statics.nearbyOfLocation = async function(location, $maxDistance, $minDistance){
  const $geometry = { type: 'Point', coordinates: location };
  return this.find({ location: { $near: { $geometry, $maxDistance, $minDistance } } });
};

module.exports = mongoose.model('Market', marketSchema);
