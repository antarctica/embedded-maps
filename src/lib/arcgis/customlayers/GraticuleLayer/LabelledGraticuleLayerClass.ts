import Color from '@arcgis/core/Color';
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { SpatialReference } from '@arcgis/core/geometry';
import Polyline from '@arcgis/core/geometry/Polyline';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import DisplayFilterInfo from '@arcgis/core/layers/support/DisplayFilterInfo';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import { SimpleRenderer } from '@arcgis/core/renderers';
import { TextSymbol } from '@arcgis/core/symbols';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

export interface LabelledGraticuleLayerProperties
  extends Omit<__esri.FeatureLayerProperties, 'renderer' | 'labelingInfo'> {
  graticuleBounds?: GraticuleBounds;
  graticuleStyle?: {
    line?: {
      color?: __esri.Color;
      width?: number;
    };
    label?: {
      color?: __esri.Color;
      font?: {
        family?: string;
        size?: number;
      };
      haloColor?: __esri.Color;
      haloSize?: number;
    };
  };
  scaleIntervals?: ScaleInterval[];
}

type GraticuleBounds = {
  minLatitude: number;
  maxLatitude: number;
};

type GraticuleStyle = {
  line: { color: __esri.Color; width: number };
  label: {
    color: __esri.Color;
    font: { family: string; size: number };
    haloColor: __esri.Color;
    haloSize: number;
  };
};

type ScaleInterval = {
  minScale: number;
  maxScale: number;
  latInterval: number;
  lonInterval: number;
};

const MIN_LATITUDE = -89;
const MAX_LATITUDE = 89;

const DEFAULT_SCALE_INTERVALS = [
  {
    minScale: Infinity,
    maxScale: 20000000,
    latInterval: 10,
    lonInterval: 30,
  },
  {
    minScale: 20000000,
    maxScale: 5000000,
    latInterval: 5,
    lonInterval: 10,
  },
  {
    minScale: 5000000,
    maxScale: 1250000,
    latInterval: 1,
    lonInterval: 5,
  },
  {
    minScale: 1250000,
    maxScale: 0,
    latInterval: 0.5,
    lonInterval: 1,
  },
];

/**
 * Initialize properties for the LabelledGraticuleLayer
 * @param properties - The properties to initialize
 * @returns The initialized properties
 */
function initializeProperties(properties?: LabelledGraticuleLayerProperties): {
  graticuleBounds: GraticuleBounds;
  graticuleStyle: GraticuleStyle;
  scaleIntervals: ScaleInterval[];
} {
  // Initialize graticuleBounds
  const graticuleBounds = {
    minLatitude: properties?.graticuleBounds?.minLatitude ?? MIN_LATITUDE,
    maxLatitude: properties?.graticuleBounds?.maxLatitude ?? MAX_LATITUDE,
  };

  // Initialize style
  const graticuleStyle = {
    line: {
      color: properties?.graticuleStyle?.line?.color ?? new Color([128, 128, 128, 1]),
      width: properties?.graticuleStyle?.line?.width ?? 1,
    },
    label: {
      color: properties?.graticuleStyle?.label?.color ?? new Color([196, 196, 196, 1]),
      font: {
        family: properties?.graticuleStyle?.label?.font?.family ?? 'sans-serif',
        size: properties?.graticuleStyle?.label?.font?.size ?? 9,
      },
      haloColor: properties?.graticuleStyle?.label?.haloColor ?? new Color([0, 0, 0, 0.7]),
      haloSize: properties?.graticuleStyle?.label?.haloSize ?? 0.1,
    },
  };

  // Initialize scaleIntervals
  const scaleIntervals = properties?.scaleIntervals ?? DEFAULT_SCALE_INTERVALS;

  return { graticuleBounds, graticuleStyle, scaleIntervals };
}

/**
 * Generate features for the LabelledGraticuleLayer
 * @param graticuleBounds - The graticule bounds
 * @param scaleIntervals - The scale intervals
 * @returns The generated features
 */
function generateFeatures(
  graticuleBounds: { minLatitude: number; maxLatitude: number },
  scaleIntervals: {
    minScale: number;
    maxScale: number;
    latInterval: number;
    lonInterval: number;
  }[],
): Graphic[] {
  const features: Graphic[] = [];
  let objectId = 1;

  const minLat = Math.max(MIN_LATITUDE, graticuleBounds.minLatitude);
  const maxLat = Math.min(MAX_LATITUDE, graticuleBounds.maxLatitude);

  scaleIntervals.forEach(({ latInterval, lonInterval }) => {
    // Generate latitude lines
    const latitudeFeatures = generateLatitudeLines(
      latInterval,
      lonInterval,
      minLat,
      maxLat,
      objectId,
    );
    features.push(...latitudeFeatures);
    objectId += latitudeFeatures.length;

    // Generate longitude lines
    const longitudeFeatures = generateLongitudeLines(
      latInterval,
      lonInterval,
      minLat,
      maxLat,
      objectId,
    );
    features.push(...longitudeFeatures);
    objectId += longitudeFeatures.length;
  });

  return features;
}

/**
 * Generate latitude lines for the LabelledGraticuleLayer
 * @param latInterval - The latitude interval
 * @param lonInterval - The longitude interval
 * @param minLat - The minimum latitude
 * @param maxLat - The maximum latitude
 * @param startObjectId - The starting object ID
 * @returns The generated latitude lines
 */
function generateLatitudeLines(
  latInterval: number,
  lonInterval: number,
  minLat: number,
  maxLat: number,
  startObjectId: number,
): Graphic[] {
  const features: Graphic[] = [];
  let objectId = startObjectId;

  const latitudesToDraw = new Set<number>();

  // Add min and max boundaries
  latitudesToDraw.add(minLat);
  latitudesToDraw.add(maxLat);

  // Generate latitude lines within bounds
  for (let lat = 90; lat >= -90; lat -= latInterval) {
    if (lat >= minLat && lat <= maxLat) {
      latitudesToDraw.add(lat);
    }
  }

  // Draw each latitude line
  latitudesToDraw.forEach((lat) => {
    const segments = [
      { start: -180, end: -90 },
      { start: -90, end: 0 },
      { start: 0, end: 90 },
      { start: 90, end: 180 },
    ];

    segments.forEach((segment) => {
      const points = [];
      for (let lon = segment.start; lon <= segment.end; lon += 0.5) {
        points.push([lon, lat]);
      }

      features.push(
        new Graphic({
          geometry: new Polyline({
            paths: [points],
            spatialReference: SpatialReference.WGS84,
          }),
          attributes: {
            ObjectID: objectId++,
            label: `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}`,
            latInterval,
            lonInterval,
          },
        }),
      );
    });
  });

  return features;
}

/**
 * Generate longitude lines for the LabelledGraticuleLayer
 * @param latInterval - The latitude interval
 * @param lonInterval - The longitude interval
 * @param minLat - The minimum latitude
 * @param maxLat - The maximum latitude
 * @param startObjectId - The starting object ID
 * @returns The generated longitude lines
 */
function generateLongitudeLines(
  latInterval: number,
  lonInterval: number,
  minLat: number,
  maxLat: number,
  startObjectId: number,
): Graphic[] {
  const features: Graphic[] = [];
  let objectId = startObjectId;

  for (let lon = -180; lon <= 180; lon += lonInterval) {
    const points = [];
    for (let lat = minLat; lat <= maxLat; lat += 1) {
      points.push([lon, lat]);
    }

    features.push(
      new Graphic({
        geometry: new Polyline({
          paths: [points],
          spatialReference: SpatialReference.WGS84,
        }),
        attributes: {
          ObjectID: objectId++,
          label: `${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`,
          latInterval,
          lonInterval,
        },
      }),
    );
  }

  return features;
}

/**
 * The LabelledGraticuleLayer class
 */
@subclass('custom.LabelledGraticuleLayer')
export class LabelledGraticuleLayer extends FeatureLayer {
  @property()
  graticuleBounds: GraticuleBounds;

  private _graticuleStyle: GraticuleStyle;

  get graticuleStyle(): GraticuleStyle {
    return this._graticuleStyle;
  }

  set graticuleStyle(value: GraticuleStyle) {
    this.renderer = new SimpleRenderer({
      symbol: new SimpleLineSymbol({
        color: value.line.color,
        width: value.line.width,
      }),
    });

    this.labelingInfo = [
      new LabelClass({
        labelExpressionInfo: {
          expression: '$feature.label',
        },
        symbol: new TextSymbol({
          color: value.label.color,
          font: {
            family: value.label.font.family,
            size: value.label.font.size,
          },
          haloColor: value.label.haloColor,
          haloSize: value.label.haloSize,
        }),
        labelPlacement: 'center-along',
        repeatLabelDistance: 500,
        minScale: 0,
        maxScale: 0,
      }),
    ];
  }

  constructor(properties?: LabelledGraticuleLayerProperties) {
    // Initialize properties with defaults using external helper functions
    const graticuleSettings = initializeProperties(properties);

    // Generate features
    const features = generateFeatures(
      graticuleSettings.graticuleBounds,
      graticuleSettings.scaleIntervals,
    );

    super({
      ...properties,
      source: features,
      fields: [
        {
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid',
        },
        {
          name: 'label',
          alias: 'Label',
          type: 'string',
        },
        {
          name: 'latInterval',
          alias: 'Latitude Interval',
          type: 'double',
        },
        {
          name: 'lonInterval',
          alias: 'Longitude Interval',
          type: 'double',
        },
      ],
      objectIdField: 'ObjectID',
      geometryType: 'polyline',
      renderer: new SimpleRenderer({
        symbol: new SimpleLineSymbol({
          color: graticuleSettings.graticuleStyle.line.color,
          width: graticuleSettings.graticuleStyle.line.width,
        }),
      }),
      labelingInfo: [
        new LabelClass({
          labelExpressionInfo: {
            expression: '$feature.label',
          },
          symbol: {
            type: 'text',
            color: graticuleSettings.graticuleStyle.label.color,
            font: {
              family: graticuleSettings.graticuleStyle.label.font.family,
              size: graticuleSettings.graticuleStyle.label.font.size,
            },
            haloColor: graticuleSettings.graticuleStyle.label.haloColor,
            haloSize: graticuleSettings.graticuleStyle.label.haloSize,
          },
          labelPlacement: 'center-along',
          repeatLabelDistance: 500,
          minScale: 0,
          maxScale: 0,
        }),
      ],
      displayFilterInfo: new DisplayFilterInfo({
        mode: 'scale',
        filters: graticuleSettings.scaleIntervals.map(
          ({ latInterval, lonInterval, maxScale, minScale }) => {
            const definitionExpression = `latInterval = ${latInterval} AND lonInterval = ${lonInterval}`;
            return {
              title: `Scale ${latInterval}°${lonInterval}°`,
              minScale,
              maxScale,
              where: definitionExpression,
            };
          },
        ),
      }),
      spatialReference: SpatialReference.WGS84,
    });

    // Assign properties to the class instance
    this.graticuleBounds = graticuleSettings.graticuleBounds;
    this._graticuleStyle = graticuleSettings.graticuleStyle;
  }
}
