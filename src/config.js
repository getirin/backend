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
      // Sorting algorithm settings for listing the available orders.
      sorting: {
        // desc order.
        order: -1,
        // different weights to possible parameters.
        factors: {
          time: 10,
          price: 10,
          markets: 25,
          distance: 55,
        },
        // create weight groups according to your needs.
        groups: {
          /**
           * For time we have 3 groups, if the order is lesser than 5 mins, we give it a %60 weight in time parameter.
           * If its greater than 10 mins, we give it %30, if its between 5-10 mins then it will be %10
           */
          time: {
            default: 10,
            factors: [{ matchers: { $lt: 5 * 60 * 1000 }, factor: 60 }, { matchers: { $gt: 10 * 60 * 1000 }, factor: 30 }]
          },
          /**
           * Products which are more expensive than 15 TL will have %70 weight. Otherwise its %30
           */
          price: {
            default: 30,
            factors: [{ matchers: { $gt: 15 }, factor: 70 }]
          }
        }
      }
    }
  }
};
