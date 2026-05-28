import type Map from '@arcgis/core/Map';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';

export type SceneViewExecuter = (view: SceneView) => Promise<void> | void;
export type MapViewExecuter = (view: MapView) => Promise<void> | void;

export interface ViewCommand {
  executeOnView: SceneViewExecuter | MapViewExecuter;
}

export interface MapCommand {
  executeOnMap: (map: Map) => Promise<ViewCommand | void>;
}
