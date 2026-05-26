import type { EventedCallback } from '@arcgis/core/core/Evented';
import type { ResourceHandle } from '@arcgis/core/core/Handles';

import { Overloads } from './utilityTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandlerLookup<LayerEvents extends any[]> = {
  [EventName in LayerEvents[0]]?: LayerEvents extends [EventName, infer CallbackHandler]
    ? CallbackHandler
    : never;
};

export type EsriEvented = {
  on: <K extends string, F extends EventedCallback>(name: K, eventHandler: F) => ResourceHandle;
};

export type EventHandlers<T extends EsriEvented> = EventHandlerLookup<
  Parameters<Overloads<T['on']>>
>;
