const mongoose = require('mongoose');
const { test: { database: { connectionString } }} = require('../../src/config');
const Market = require('../../src/models/Market');

describe('market integration tests', () => {
  const testData = [
    { name: 'Market #1', location: [0, 0] },
    { name: 'Market #2', location: [3, 5] },
    { name: 'Market #3', location: [2, 3] },
  ];

  describe('MarketModel', () => {

    beforeAll(async () => {
      await mongoose.connect(connectionString);
    });

    beforeEach(async () => {
      for(let i = 0; i < testData.length; i++) {
        expect(await new Market(testData[i]).save()).toHaveProperty('_id');
      }
    });

    it('should properly return nearby markets', async () => {
      expect(await Market.nearbyOfLocation([0, 0], 1, 0)).toHaveLength(1);
    });

    afterEach(async () => {
      await Market.remove();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });
  });
});
