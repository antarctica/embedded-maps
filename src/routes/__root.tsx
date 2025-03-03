import { css } from '@styled-system/css';
import { VisuallyHidden } from '@styled-system/jsx';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import * as React from 'react';
import { z } from 'zod';

const assetSearchSchema = z.object({
  'asset-id': fallback(z.string().optional(), undefined),
  'globe-overview': fallback(z.boolean().optional(), undefined),
  center: fallback(z.array(z.number()).length(2).optional(), undefined),
  zoom: fallback(z.number().optional(), undefined),
  scale: fallback(z.number().optional(), undefined),
  bbox: fallback(z.array(z.number()).length(4).optional(), undefined),
  'hide-ui': fallback(z.boolean().optional(), undefined),
  'show-region': fallback(z.boolean().optional(), undefined),
  'show-asset-popup': fallback(z.boolean().optional(), undefined),
  'show-full-screen': fallback(z.boolean().optional(), undefined),
});

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className={css({ w: 'full', h: 'full' })}>
        <VisuallyHidden>
          <h1>British Antarctic Survey Embedded Map</h1>
        </VisuallyHidden>
        <Outlet />
      </main>
    </React.Fragment>
  ),
  validateSearch: zodValidator(assetSearchSchema),
});
