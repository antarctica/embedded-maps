export interface PostInitCommand {
  execute: (view: __esri.MapView) => Promise<void> | void;
}

export interface MapCommand {
  execute: () => Promise<void | PostInitCommand>;
}
