import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';

import { MapInternalContext } from './ArcInternalViewContext';

export const ArcInternalViewProvider = ({
  children,
  view,
}: React.PropsWithChildren<{ view: MapView | SceneView | undefined }>) => {
  return <MapInternalContext.Provider value={view}>{children}</MapInternalContext.Provider>;
};
