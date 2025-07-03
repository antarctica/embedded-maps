import EsriMap from '@arcgis/core/Map';
import EsriWebMap from '@arcgis/core/WebMap';

import type { MapCommand, ViewCommand } from '@/lib/arcgis/typings/commandtypes';

interface MapInstanceData {
  map: EsriMap;
  postInitCommands: ViewCommand[];
}

class MapSingleton {
  private static instances = new Map<string, MapSingleton>();
  private mapData: MapInstanceData | null = null;
  private initializationPromise: Promise<MapInstanceData> | null = null;
  private id: string;

  private constructor(id: string = 'default') {
    this.id = id;
  }

  static getInstance(id?: string): MapSingleton {
    const instanceId = id || 'default';
    if (!MapSingleton.instances.has(instanceId)) {
      MapSingleton.instances.set(instanceId, new MapSingleton(instanceId));
    }
    return MapSingleton.instances.get(instanceId)!;
  }

  async getOrCreateMap(
    commands: MapCommand[],
    executeCommands: (
      map: EsriMap | EsriWebMap,
      commands: MapCommand[],
    ) => Promise<(ViewCommand | void)[]>,
    initialMap?: EsriMap,
  ): Promise<MapInstanceData> {
    if (this.mapData?.map.destroyed) {
      this.reset();
    }

    // Return existing map if available
    if (this.mapData) {
      return this.mapData;
    }

    // Return ongoing initialization if in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Start new initialization
    this.initializationPromise = initialMap
      ? this.initializeExistingMap(initialMap, commands, executeCommands)
      : this.createMap(commands, executeCommands);

    try {
      this.mapData = await this.initializationPromise;
      return this.mapData;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeExistingMap(
    map: EsriMap | EsriWebMap,
    commands: MapCommand[],
    executeCommands: (map: EsriMap, commands: MapCommand[]) => Promise<(ViewCommand | void)[]>,
  ): Promise<MapInstanceData> {
    console.log(`Initializing existing map instance (singleton: ${this.id})`);
    if (map instanceof EsriWebMap) {
      await map.load();
    }
    const results = await executeCommands(map, commands);
    const postInitCommands = results.filter((result): result is ViewCommand => result != null);
    return { map, postInitCommands };
  }

  private async createMap(
    commands: MapCommand[],
    executeCommands: (map: EsriMap, commands: MapCommand[]) => Promise<(ViewCommand | void)[]>,
  ): Promise<MapInstanceData> {
    console.log(`Creating new map instance (singleton: ${this.id})`);

    const map = new EsriMap();
    const results = await executeCommands(map, commands);
    const postInitCommands = results.filter((result): result is ViewCommand => result != null);

    return { map, postInitCommands };
  }

  getMap(): EsriMap | null {
    if (this.mapData?.map.destroyed) {
      this.reset();
      return null;
    }
    return this.mapData?.map ?? null;
  }

  getPostInitCommands(): ViewCommand[] {
    return this.mapData?.postInitCommands ?? [];
  }

  isInitialized(): boolean {
    return this.mapData !== null;
  }

  reset(): void {
    this.mapData = null;
    this.initializationPromise = null;
  }

  // Static methods for managing all instances
  static resetAll(): void {
    MapSingleton.instances.forEach((instance) => instance.reset());
    MapSingleton.instances.clear();
  }

  static resetInstance(id: string): void {
    const instance = MapSingleton.instances.get(id);
    if (instance) {
      instance.reset();
      MapSingleton.instances.delete(id);
    }
  }

  static getAllInstanceIds(): string[] {
    return Array.from(MapSingleton.instances.keys());
  }

  static hasInstance(id: string): boolean {
    return MapSingleton.instances.has(id);
  }
}

// Export the default instance for backward compatibility
export const mapSingleton = MapSingleton.getInstance();

// Export the class for creating named instances
export { MapSingleton };
