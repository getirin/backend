const host = process.env.APP_HOST || 'localhost';
const port = process.env.PORT || 8080;

module.exports = {
  host,
  port,
  cors: process.env.ENABLE_CORS || true,
  swagger: {
    host: process.env.SWAGGER_HOST || host,
    port: process.env.SWAGGER_PORT || port,
    schemes: JSON.parse(process.env.SWAGGER_SCHEMES || '["http"]'),
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
  },
  database: {
    connectionString: process.env.MONGODB_CONNECTION_STRING || process.env.MONGODB_URI || 'mongodb://localhost/getirin',
  },
  test: {
    database: {
      connectionString: process.env.TEST_MONGODB_CONNECTION_STRING || 'mongodb://localhost/getirin-test'
    }
  },
  application: {
    orderMatch: {
      // The radius that determines which markets can supply a specific order
      closeMarketMaxDistance: 1000,
    }
  }
};
