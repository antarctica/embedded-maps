import {
  DEFAULT_LEGACY_THEME,
  DEFAULT_REGIONAL_EXTENT,
  DEFAULT_SHOW_ASSET_POPUP,
  DEFAULT_SHOW_FULLSCREEN_BUTTON,
  DEFAULT_SHOW_GLOBE_OVERVIEW,
  DEFAULT_SHOW_GRATICULE,
  DEFAULT_SHOW_RESET_BUTTON,
  DEFAULT_SHOW_ZOOM_BUTTON,
} from '@/lib/config/mapParamDefaults';
import { Route } from '@/routes/__root';

import {
  bboxParamToArray,
  convertEmptyStringParamToBooleanPresence,
  mapPointParamToArray,
} from '../config/schema';

export function useMapParams() {
  const {
    // View parameters
    zoom,
    scale,
    centre,
    bbox,
    points,
    'bbox-force-regional-extent': bboxForceRegionalExtent = DEFAULT_REGIONAL_EXTENT,

    // UI Controls
    'ctrl-zoom': showZoomButton = DEFAULT_SHOW_ZOOM_BUTTON,
    'ctrl-reset': showResetButton = DEFAULT_SHOW_RESET_BUTTON,
    'ctrl-fullscreen': showFullscreenButton = DEFAULT_SHOW_FULLSCREEN_BUTTON,
    'legacy-theme': legacyTheme = DEFAULT_LEGACY_THEME,

    // Globe overview
    'globe-overview': showGlobeOverview = DEFAULT_SHOW_GLOBE_OVERVIEW,

    // Asset parameters
    'asset-id': assetId,
    'asset-type': assetType,
    'asset-force-popup': assetForcePopup = DEFAULT_SHOW_ASSET_POPUP,

    // Overlays
    graticule: showGraticule = DEFAULT_SHOW_GRATICULE,
  } = Route.useSearch();

  return {
    // View parameters
    zoom,
    scale,
    centre,
    bbox: bbox ? bboxParamToArray(bbox) : undefined,
    points: points ? mapPointParamToArray(points) : undefined,
    bboxForceRegionalExtent: convertEmptyStringParamToBooleanPresence(bboxForceRegionalExtent),

    // UI Controls
    showZoomButton: convertEmptyStringParamToBooleanPresence(showZoomButton),
    showResetButton: convertEmptyStringParamToBooleanPresence(showResetButton),
    showFullscreenButton: convertEmptyStringParamToBooleanPresence(showFullscreenButton),
    legacyTheme: convertEmptyStringParamToBooleanPresence(legacyTheme),

    // Globe overview
    showGlobeOverview: convertEmptyStringParamToBooleanPresence(showGlobeOverview),

    // Asset parameters
    assetId,
    assetType,
    assetForcePopup: convertEmptyStringParamToBooleanPresence(assetForcePopup),

    // Overlays
    showGraticule: convertEmptyStringParamToBooleanPresence(showGraticule),
  };
}
