const { mergeRoutes, deepGet } = require('../../src/utils');

describe('utils', () => {
  describe('mergeRoutes', () => {
    it('should have one route for same path/method', () => {
      const original = [{ path: '/', method: 'GET', original: true }, { path: '/', method: 'POST', original: true }];
      const toMerge = [{ path: '/', method: 'GET', original: false }];
      const expected = [{ path: '/', method: 'GET', original: false }, { path: '/', method: 'POST', original: true }];

      expect(mergeRoutes(original, toMerge)).toEqual(expected);
    });
  });

  describe('deepGet', () => {
    const testObj = {
      a: 'hello',
      b: { c: { d: 5 } },
      d: { e: 4 },
      f: { g: { h: 'world' } },
    };

    it('should get values that are present', () => {
      expect(deepGet(testObj, 'a')).toBe('hello');
      expect(deepGet(testObj, 'b.c.d')).toBe(5);
      expect(deepGet(testObj, 'd')).toEqual({ e: 4 });
      expect(deepGet(testObj, 'f.g')).toEqual({ h: 'world' });
    });

    it('should return undefined for non present values', () => {
      expect(deepGet(testObj, 'a.b')).toBe(undefined);
      expect(deepGet(testObj, 'x')).toBe(undefined);
      expect(deepGet(testObj, 'x.y')).toBe(undefined);
      expect(deepGet(testObj, 'f.g.h.j.k.l.m.n.o')).toBe(undefined);
    });
  });
});
