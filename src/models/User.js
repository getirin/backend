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

userSchema.statics.findUserByNameAndType = async function(name, userType){
  const user = await this.findOne({ name, userType });
  if(!user) throw new Error("Couldn't find user with the given name.");
  return user;
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
