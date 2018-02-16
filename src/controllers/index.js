module.exports = (dependencies) => ({
  healthz: require('./healthz')(dependencies),
});
