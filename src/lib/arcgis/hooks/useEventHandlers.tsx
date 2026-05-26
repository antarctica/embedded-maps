import type { EventedCallback, EventedMixin, EventNames } from '@arcgis/core/core/Evented';
import type { ResourceHandle } from '@arcgis/core/core/Handles';
import { useEffect } from 'react';

import type { EventHandlers } from '../typings/EsriTypes';

export const useEventHandlers = <View extends EventedMixin>(
  accessor?: View,
  eventHandlers?: EventHandlers<View>,
): void => {
  useEffect(() => {
    if (!accessor || !eventHandlers) return;

    const handles: ResourceHandle[] = [];

    for (const event in eventHandlers) {
      const handler = eventHandlers[event as keyof EventHandlers<View>];
      if (!handler) continue;
      handles.push(accessor.on(event as EventNames<View>, handler as EventedCallback));
    }

    return () => {
      for (const handle of handles) handle.remove();
    };
  }, [eventHandlers, accessor]);
};
