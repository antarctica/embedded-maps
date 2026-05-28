import '@arcgis/map-components/components/arcgis-scale-bar';

import type * as React from 'react';
import { tv } from 'tailwind-variants';

type ScaleControlProps = React.JSX.IntrinsicElements['arcgis-scale-bar'];

const scaleControl = tv({
  base: [
    'scale-control',
    '[--calcite-color-foreground-1:var(--scalebar-bg)]',
    '[--calcite-color-text-1:var(--scalebar-text)]',
  ],
});

function ScaleControl({
  className,
  unit = 'dual',
  id = 'map-scale-bar',
  autoDestroyDisabled = true,
  ...props
}: ScaleControlProps) {
  return (
    <arcgis-scale-bar
      {...props}
      className={scaleControl({ className })}
      id={id}
      autoDestroyDisabled={autoDestroyDisabled}
      unit={unit}
    />
  );
}

export default ScaleControl;
