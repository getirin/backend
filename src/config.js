const host = process.env.APP_HOST || 'localhost';
const port = process.env.PORT || 8080;

module.exports = {
  host,
  port,
  swagger: {
    host: process.env.SWAGGER_HOST || host,
    port: process.env.SWAGGER_PORT || port,
  },
  logging: {
    name: 'backend-boilerplate',
    level: 'info'
  },
  auth: {
    jwt: {
      key: process.env.JWT_KEY || 'nonSecure',
      algorithm: process.env.JWT_ALGORITHM || 'HS256',
    },
  }
};
