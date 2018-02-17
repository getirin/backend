const { loginRequest, loginSuccess, putRequestSuccess, geoPoint } = require('./common');

module.exports = {
  loginGetRequestPayload: loginRequest,
  loginGetSuccess: loginSuccess,
  lastSeenPostRequest: {
    location: geoPoint.required(),
  },
  lastSeenPostResponse: putRequestSuccess
};
