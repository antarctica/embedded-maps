import '@arcgis/map-components/components/arcgis-popup';

import type * as React from 'react';
import { tv } from 'tailwind-variants';

import { useArcPopup } from '@/lib/arcgis/contexts/ArcPopupContext';
import { useCurrentMapView } from '@/lib/arcgis/hooks';

type PopupControlProps = React.JSX.IntrinsicElements['arcgis-popup'];

const dockOptions = {
  buttonEnabled: false,
};

// The host is normally `display: contents`, so the popup lays itself out against the whole map.
// Giving it a box that stops short of the attribution bar (`--attribution-height`, set by Map from
// the bar's measured height) makes a docked popup sit above the attribution instead of covering
// it. The top-left origin is unchanged, so floating popups still anchor correctly.
const popupControl = tv({
  base: 'pointer-events-none absolute inset-x-0 top-0 bottom-[var(--attribution-height,0px)] block',
});

function PopupControl({ className, ...props }: PopupControlProps): React.ReactElement {
  const { onPopupMount } = useArcPopup();
  const mapView = useCurrentMapView();

  return (
    <arcgis-popup
      // The dialog's aria-label is bound to `heading`, not the displayed feature title, so an
      // unset heading leaves the dialog unnamed. A feature's PopupTemplate title still takes
      // precedence for the visible heading.
      heading="Feature details"
      defaultPopupTemplateEnabled
      includeDefaultActionsDisabled
      {...props}
      className={popupControl({ className })}
      ref={(popupElement) => {
        if (popupElement) {
          onPopupMount(popupElement);
        }
      }}
      view={mapView}
      dockEnabled={false}
      dockOptions={dockOptions}
      slot="popup"
    />
  );
}

export default PopupControl;
