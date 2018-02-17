const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: { type: String, default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
}, { timestamps: true });

userSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Market', userSchema);
