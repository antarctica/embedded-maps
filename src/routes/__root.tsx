import { createRootRoute, Outlet } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import * as React from 'react';
import { z } from 'zod';

import AuthWrapper from '@/arcgis/auth/AuthWrapper';

const assetSearchSchema = z.object({
  asset_id: fallback(z.string().optional(), undefined),
  globe_overview: fallback(z.boolean().optional(), undefined),
  center: fallback(z.array(z.number()).length(2).optional(), undefined),
  zoom: fallback(z.number().optional(), undefined),
  scale: fallback(z.number().optional(), undefined),
  bbox: fallback(z.array(z.number()).length(4).optional(), undefined),
});

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <AuthWrapper appId="m3Tb1Ix8KOmX1Vh4">
        <Outlet />
      </AuthWrapper>
    </React.Fragment>
  ),
  validateSearch: zodValidator(assetSearchSchema),
});
