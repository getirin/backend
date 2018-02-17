const mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose);
const CourrierRequest = require('../schemas/models/CourrierRequest');

const courrierRequestSchema = new mongoose.Schema(Joigoose.convert(CourrierRequest), { timestamps: true });
courrierRequestSchema.index({ courrier: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('CourrierRequest', courrierRequestSchema);
