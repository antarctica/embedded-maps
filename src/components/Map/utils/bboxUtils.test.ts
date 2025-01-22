import { describe, expect, it } from 'vitest';

import { MapProjection } from '@/config/basemap';

import { createGeometryFromBBox, createLatitudeParallelPoints } from './bboxUtils';

describe('bboxUtils', () => {
  describe('createLatitudeParallelPoints', () => {
    it('creates a densified edge', () => {
      const edge = createLatitudeParallelPoints(-10, 10, -20, 5);
      expect(edge).toHaveLength(5);
      expect(edge).toEqual([
        [-10, -20],
        [-5, -20],
        [0, -20],
        [5, -20],
        [10, -20],
      ]);
    });
  });

  describe('createGeometryFromBBox', () => {
    it('creates standard bbox in web mercator projection', () => {
      const bbox: [number, number, number, number] = [-10, -20, 10, 20];
      const polygon = createGeometryFromBBox(bbox, MapProjection.WORLD);

      expect(polygon.rings).toEqual([
        [
          [-10, -20],
          [10, -20],
          [10, 20],
          [-10, 20],
          [-10, -20],
        ],
      ]);
      expect(polygon.spatialReference.wkid).toEqual(4326);
    });
  });

  it('creates a standard bbox for South Georgia projection', () => {
    const bbox: [number, number, number, number] = [-38.643677, -55.200717, -35.271423, -53.641972];
    const polygon = createGeometryFromBBox(bbox, MapProjection.SOUTH_GEORGIA, 5);

    expect(polygon.rings).toEqual([
      [
        [-38.643677, -55.200717],
        [-35.271423, -55.200717],
        [-35.271423, -53.641972],
        [-38.643677, -53.641972],
        [-38.643677, -55.200717],
      ],
    ]);
  });

  it('creates a ring in the arctic projection when the bbox does not cross the antimeridian', () => {
    const bbox: [number, number, number, number] = [-10, 60, 10, 80];
    const polygon = createGeometryFromBBox(bbox, MapProjection.ARCTIC, 5);

    // we expect the ring to be densified to 10 steps.
    expect(polygon.rings).toEqual([
      [
        [-10, 60],
        [-5, 60],
        [0, 60],
        [5, 60],
        [10, 60],
        [10, 80],
        [5, 80],
        [0, 80],
        [-5, 80],
        [-10, 80],
        [-10, 60],
      ],
    ]);
    expect(polygon.spatialReference.wkid).toEqual(4326);
  });

  it('creates a ring in the antarctic projection when the bbox does not cross the antimeridian', () => {
    const bbox: [number, number, number, number] = [-10, -80, 10, -60];
    const polygon = createGeometryFromBBox(bbox, MapProjection.ANTARCTIC, 5);

    expect(polygon.rings).toEqual([
      [
        [-10, -80],
        [-5, -80],
        [0, -80],
        [5, -80],
        [10, -80],
        [10, -60],
        [5, -60],
        [0, -60],
        [-5, -60],
        [-10, -60],
        [-10, -80],
      ],
    ]);
    expect(polygon.spatialReference.wkid).toEqual(4326);
  });

  it('creates a ring in the arctic projection when the bbox crosses the antimeridian', () => {
    const bbox: [number, number, number, number] = [170, 60, -170, 80];
    const polygon = createGeometryFromBBox(bbox, MapProjection.ARCTIC, 5);
    expect(polygon.rings).toHaveLength(2);

    // Western polygon (minLon to 180)
    expect(polygon.rings[0]).toEqual([
      [170, 60],
      [175, 60],
      [180, 60],
      [180, 80],
      [175, 80],
      [170, 80],
      [170, 60],
    ]);

    // Eastern polygon (-180 to maxLon)
    expect(polygon.rings[1]).toEqual([
      [-180, 60],
      [-175, 60],
      [-170, 60],
      [-170, 80],
      [-175, 80],
      [-180, 80],
      [-180, 60],
    ]);
  });
});
