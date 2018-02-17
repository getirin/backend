const { mergeRoutes, deepGet, deepSet, pick } = require('../../src/utils');

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

  describe('deepSet', () => {
    const testObj = { a: 5, b: { c: 10 } };

    it('should not mutate objects', () => {
      expect(deepSet(testObj, 'a', 10)).not.toEqual(testObj);
      expect(deepSet(testObj, 'b.c', 5)).not.toEqual(testObj);
    });

    it('should set values correctly', () => {
      expect(deepSet(testObj, 'a', 10)).toEqual({ a: 10, b: { c: 10 } });
      expect(deepSet(testObj, 'b.c', 5)).toEqual({ a: 5, b: { c: 5 } });
    });

    it('should set non defined keys correctly', () => {
      expect(deepSet(testObj, 'd', 73)).toEqual({ a: 5, b: { c: 10 }, d : 73});
      expect(deepSet(testObj, 'd.e', 73)).toEqual({ a: 5, b: { c: 10 }, d : { e: 73 }});
    });
  });

  describe('pick', () => {
    const testObj = {
      a: 'hello',
      b: { c: { d: 5 } },
      d: { e: 4 },
      f: { g: { h: 'world' } },
    };

    it('should return empty object for non defined keys', () => {
      expect(pick(testObj, ['z'])).toEqual({});
    });

    it('should return an object with selected keys only for valid keys', () => {
      expect(pick(testObj, ['a', 'b'])).toEqual({ a: testObj.a, b: testObj.b });
      expect(pick(testObj, ['a', 'c'])).toEqual({ a: testObj.a, c: testObj.c });
      expect(pick(testObj, ['d'])).toEqual({ d: testObj.d });
      expect(pick(testObj, 'd')).toEqual({ d: testObj.d });
    });

    it('should not fail with undefined obj', () => {
      expect(pick(undefined, [])).toEqual({});
    });

    it('should not fail with invalid keys', () => {
      expect(pick(testObj, undefined)).toEqual({});
    });
  });
});
