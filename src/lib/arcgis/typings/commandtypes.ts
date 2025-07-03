export type SceneViewExecuter = (view: __esri.SceneView) => Promise<void> | void;
export type MapViewExecuter = (view: __esri.MapView) => Promise<void> | void;

export interface ViewCommand {
  executeOnView: SceneViewExecuter | MapViewExecuter;
}

export interface MapCommand {
  executeOnMap: (map: __esri.Map) => Promise<ViewCommand | void>;
}
