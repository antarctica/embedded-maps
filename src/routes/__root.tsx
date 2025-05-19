import { createRootRoute, Outlet } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import * as React from 'react';
import { z } from 'zod';

import { DEFAULT_CENTER } from '@/lib/config/mapParamDefaults';

export const CoordinatePair = z.tuple([z.number(), z.number()]);
export const BBox = z.tuple([z.number(), z.number(), z.number(), z.number()]);

const booleanWithoutValue = () => z.union([z.literal(''), z.boolean()]);

const baseSearchSchema = z.object({
  // View parameters
  zoom: fallback(z.number().optional(), undefined),
  scale: fallback(z.number().optional(), undefined),
  centre: fallback(CoordinatePair.optional(), undefined),
  bbox: fallback(BBox.optional(), undefined),
  'bbox-force-regional-extent': fallback(booleanWithoutValue().optional(), undefined),

  // UI Controls
  'ctrl-zoom': fallback(booleanWithoutValue().optional(), undefined),
  'ctrl-reset': fallback(booleanWithoutValue().optional(), undefined),
  'ctrl-fullscreen': fallback(booleanWithoutValue().optional(), undefined),

  // Globe overview
  'globe-overview': fallback(booleanWithoutValue().optional(), undefined),

  // Asset parameters
  'asset-id': fallback(z.string().optional(), undefined),
  'asset-force-popup': fallback(booleanWithoutValue().optional(), undefined),
});

type SearchParams = z.infer<typeof baseSearchSchema>;

function resolveInitialViewpoint(data: SearchParams): SearchParams {
  // Asset location takes precedence over all other viewpoint parameters
  if (data['asset-id']) {
    return { ...data, bbox: undefined, centre: undefined };
  }
  // Bounding box takes precedence over center point
  if (data.bbox) {
    return { ...data, centre: undefined };
  }

  // Default to center point if no other viewpoint is specified
  if (!data.centre && !data.bbox && !data['asset-id']) {
    return { ...data, centre: DEFAULT_CENTER };
  }

  return data;
}

function resolveZoomScaleConflict(data: SearchParams): SearchParams {
  // zoom should always override scale
  if (data.zoom && data.scale) {
    return { ...data, scale: undefined };
  }
  return data;
}

const assetSearchSchema = baseSearchSchema
  .transform(resolveInitialViewpoint)
  .transform(resolveZoomScaleConflict);

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className="h-full w-full">
        <h1 className="sr-only">British Antarctic Survey Embedded Map Service</h1>
        <Outlet />
      </main>
    </React.Fragment>
  ),
  validateSearch: zodValidator(assetSearchSchema),
});
