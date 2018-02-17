const mongoose = require('mongoose');
const { userTypes } = require('../resources/model-constants');
const { createMongooseEnumValidator } = require('../utils');

const userSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String, bcrypt: true },
  userType: { type: Number, validate: createMongooseEnumValidator(Object.values(userTypes), 'Invalid user type!') },
}, { timestamps: true });

userSchema.index({ name: 1 }, { unique: true });
userSchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('User', userSchema);