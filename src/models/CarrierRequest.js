const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose);
const CarrierRequest = require('../schemas/models/CarrierRequest');

const carrierRequestSchema = new mongoose.Schema(Joigoose.convert(CarrierRequest), { timestamps: true });
carrierRequestSchema.index({ carrier: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('CarrierRequest', carrierRequestSchema);
