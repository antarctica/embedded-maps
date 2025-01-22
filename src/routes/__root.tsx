import { css } from '@styled-system/css';
import { VisuallyHidden } from '@styled-system/jsx';
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
  hide_ui: fallback(z.boolean().optional(), undefined),
  show_region: fallback(z.boolean().optional(), undefined),
});

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className={css({ w: 'full', h: 'full' })}>
        <VisuallyHidden>
          <h1>British Antarctic Survey Embedded Map</h1>
        </VisuallyHidden>

        <AuthWrapper appId="m3Tb1Ix8KOmX1Vh4">
          <Outlet />
        </AuthWrapper>
      </main>
    </React.Fragment>
  ),
  validateSearch: zodValidator(assetSearchSchema),
});
