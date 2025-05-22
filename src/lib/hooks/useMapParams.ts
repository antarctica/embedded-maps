import { bboxParamToArray } from '@/components/Map/utils/bboxUtils';
import {
  DEFAULT_REGIONAL_EXTENT,
  DEFAULT_SHOW_ASSET_POPUP,
  DEFAULT_SHOW_FULLSCREEN_BUTTON,
  DEFAULT_SHOW_GLOBE_OVERVIEW,
  DEFAULT_SHOW_RESET_BUTTON,
  DEFAULT_SHOW_ZOOM_BUTTON,
} from '@/lib/config/mapParamDefaults';
import { Route } from '@/routes/__root';

function convertEmptyStringParamToBooleanPresence(
  value: '' | boolean | undefined,
): boolean | undefined {
  if (value === '') return true;
  return value;
}

export function useMapParams() {
  const {
    // View parameters
    zoom,
    scale,
    centre,
    bbox,
    'bbox-force-regional-extent': bboxForceRegionalExtent = DEFAULT_REGIONAL_EXTENT,

    // UI Controls
    'ctrl-zoom': showZoomButton = DEFAULT_SHOW_ZOOM_BUTTON,
    'ctrl-reset': showResetButton = DEFAULT_SHOW_RESET_BUTTON,
    'ctrl-fullscreen': showFullscreenButton = DEFAULT_SHOW_FULLSCREEN_BUTTON,

    // Globe overview
    'globe-overview': showGlobeOverview = DEFAULT_SHOW_GLOBE_OVERVIEW,

    // Asset parameters
    'asset-id': assetId,
    'asset-force-popup': assetForcePopup = DEFAULT_SHOW_ASSET_POPUP,
  } = Route.useSearch();

  return {
    // View parameters
    zoom,
    scale,
    centre,
    bbox: bbox ? bboxParamToArray(bbox) : undefined,
    bboxForceRegionalExtent,

    // UI Controls
    showZoomButton: convertEmptyStringParamToBooleanPresence(showZoomButton),
    showResetButton: convertEmptyStringParamToBooleanPresence(showResetButton),
    showFullscreenButton: convertEmptyStringParamToBooleanPresence(showFullscreenButton),

    // Globe overview
    showGlobeOverview: convertEmptyStringParamToBooleanPresence(showGlobeOverview),

    // Asset parameters
    assetId,
    assetForcePopup: convertEmptyStringParamToBooleanPresence(assetForcePopup),
  };
}
