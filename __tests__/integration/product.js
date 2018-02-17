const mongoose = require('mongoose');
const { test: { database: { connectionString } } } = require('../../src/config');
const Product = require('../../src/models/Product');

describe('product integration tests', () => {
  describe('ProductModel', () => {
    beforeAll(async () => {
      await mongoose.connect(connectionString);
    });

    const testData = [
      { name: 'Domates', price: 3 },
      { name: 'Biber', price: 7 },
      { name: 'Patlıcan', price: 2 }
    ];

    it('should save without any problems', async () => {
      for(let i = 0; i < testData.length; i++){
        expect(await new Product(testData[i]).save()).toHaveProperty('_id');
      }
    });

    it('should properly calculate totalPrice for recorded products', async () => {
      const saved = await Promise.all(testData.map((data) => new Product(data).save()));
      const totalPrice = testData.reduce((acc, p) => acc + p.price, 0);

      expect(await Product.calculateTotalPriceOfProducts(saved.map(p => p._id))).toEqual(totalPrice);
    });

    afterEach(async () => {
      await Product.remove();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });
  });
});
