const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: { type: String, default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
}, { timestamps: true });

marketSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Market', marketSchema);
