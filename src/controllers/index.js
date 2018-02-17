module.exports = (dependencies) => ({
  healthz: require('./healthz')(dependencies),
  user: require('./user')(dependencies),
  courrier: require('./courrier')(dependencies),
});
