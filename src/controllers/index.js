module.exports = (dependencies) => ({
  healthz: require('./healthz')(dependencies),
  user: require('./user')(dependencies),
  carrier: require('./carrier')(dependencies),
  product: require('./product')(dependencies),
  market: require('./market')(dependencies),
  order: require('./order')(dependencies),
  request: require('./request')(dependencies),
});
