import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as React from 'react';
import { z } from 'zod';

import { DEFAULT_CENTER } from '@/lib/config/mapParamDefaults';
import {
  AssetIdsParam,
  AssetTypesParam,
  BBoxParam,
  booleanWithoutValue,
  CoordinatePair,
  MapPointParam,
  PortalItemIdsParam,
} from '@/lib/config/schema';

const baseSearchSchema = z.object({
  // View parameters
  zoom: z.number().optional().catch(undefined),
  scale: z.number().optional().catch(undefined),
  centre: CoordinatePair.optional().catch(undefined),
  bbox: BBoxParam.optional().catch(undefined),
  'bbox-force-regional-extent': booleanWithoutValue().optional().catch(undefined),
  points: MapPointParam.optional().catch(undefined),

  // Data layers
  layers: PortalItemIdsParam.optional().catch(undefined),

  // UI Controls
  'ctrl-zoom': booleanWithoutValue().optional().catch(undefined),
  'ctrl-reset': booleanWithoutValue().optional().catch(undefined),
  'ctrl-fullscreen': booleanWithoutValue().optional().catch(undefined),
  theme: z.enum(['bsk1', 'bsk2']).optional().catch(undefined),

  // Globe overview
  'globe-overview': booleanWithoutValue().optional().catch(undefined),

  // Overlays
  'ctrl-graticule': booleanWithoutValue().optional().catch(undefined),

  // Asset parameters
  'asset-id': AssetIdsParam.optional().catch(undefined),
  'asset-type': AssetTypesParam.optional().catch(undefined),
  'asset-force-popup': booleanWithoutValue().optional().catch(undefined),
});

type SearchParams = z.infer<typeof baseSearchSchema>;

function resolveInitialViewpoint(data: SearchParams): SearchParams {
  // Asset location takes precedence over all other viewpoint parameters
  if (data['asset-id']) {
    return { ...data, bbox: undefined, centre: undefined };
  }
  // Bounding box takes precedence over center point
  if (data.bbox || data.points) {
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
  validateSearch: assetSearchSchema,
});
