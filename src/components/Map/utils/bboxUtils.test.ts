import { describe, expect, it } from 'vitest';

import { createBboxPolygonRings } from './bboxUtils';

describe('bboxUtils', () => {
  describe('createBboxPolygonRings', () => {
    it('creates standard bbox rings when not crossing antimeridian', () => {
      const bbox: [number, number, number, number] = [-10, -20, 10, 20];
      const rings = createBboxPolygonRings(bbox);

      expect(rings).toEqual([
        [
          [-10, -20],
          [10, -20],
          [10, 20],
          [-10, 20],
          [-10, -20],
        ],
      ]);
    });

    it('creates rings for South Georgia bbox', () => {
      const bbox: [number, number, number, number] = [
        -38.643677, -55.200717, -35.271423, -53.641972,
      ];
      const rings = createBboxPolygonRings(bbox);

      expect(rings).toEqual([
        [
          [-38.643677, -55.200717],
          [-35.271423, -55.200717],
          [-35.271423, -53.641972],
          [-38.643677, -53.641972],
          [-38.643677, -55.200717],
        ],
      ]);
    });

    it('creates two rings when bbox crosses the antimeridian', () => {
      const bbox: [number, number, number, number] = [170, 60, -170, 80];
      const rings = createBboxPolygonRings(bbox);

      expect(rings).toHaveLength(2);

      // Western polygon (minLon to 180)
      expect(rings[0]).toEqual([
        [170, 60],
        [180, 60],
        [180, 80],
        [170, 80],
        [170, 60],
      ]);

      // Eastern polygon (-180 to maxLon)
      expect(rings[1]).toEqual([
        [-180, 60],
        [-170, 60],
        [-170, 80],
        [-180, 80],
        [-180, 60],
      ]);
    });
  });
});
