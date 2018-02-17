const mongoose = require('mongoose');
const { userTypes } = require('../resources/model-constants');
const { createMongooseEnumValidator, createNearGeoQuery } = require('../utils');

const userSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String, bcrypt: true },
  userType: { type: Number, validate: createMongooseEnumValidator(Object.values(userTypes), 'Invalid user type!') },
  lastSeen: { type: [Number], index: '2dsphere' }
}, { timestamps: true });

userSchema.index({ name: 1 }, { unique: true });
userSchema.plugin(require('mongoose-bcrypt'));

userSchema.statics.findUserByNameAndType = async function(name, userType){
  const user = await this.findOne({ name, userType });
  if(!user) throw new Error("Couldn't find user with the given name.");
  return user;
};

userSchema.statics.nearbyOfLocation = async function(location, $maxDistance, $minDistance, userType){
  return this.find({ lastSeen: createNearGeoQuery(location, $maxDistance, $minDistance), userType }).exec();
};

/**
 * Finds the given user in the database, or creates a new one.
 * @param name
 * @param password
 * @param userType
 * @return {Promise<*>}
 */
userSchema.statics.findOrCreate = async function({ name, password, userType }){
  return this.findUserByNameAndType(name, userType)
    .catch(() => new this({ name, password, userType }).save());
};

module.exports = mongoose.model('User', userSchema);
