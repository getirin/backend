module.exports = {
  http: {
    '400': 'bad_request',
    '401': 'missing_authentication',
    '404': 'not_found',
    '500': 'internal_server_error',
    '501': 'not_implemented',
  },
  invalidRequestBody: 'invalid_request_body',
  invalidPayloadJson: 'invalid_payload_json',
  noCustomMessage: 'no_custom_message',
  // custom business logic errors below.
  customerLoginFail: 'user_login_fail',
};
