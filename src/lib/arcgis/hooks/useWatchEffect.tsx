import type Accessor from '@arcgis/core/core/Accessor';
import { type ReactiveWatchOptions, watch, when } from '@arcgis/core/core/reactiveUtils';
import * as React from 'react';

export function useWatchEffect<T>(
  getValue: () => T,
  callback: (newValue: T, oldValue: T | null | undefined) => void,
  options?: ReactiveWatchOptions,
) {
  React.useEffect(() => {
    // Watch for changes to value
    const handle = watch(getValue, callback, { initial: true, ...options });

    // Remove watch when component unmounts
    return () => {
      handle.remove();
    };
  }, [callback, getValue, options]);
}

export function useWhenEffect<T>(
  getValue: () => T,
  callback: (newValue: T, oldValue: T | null | undefined) => void,
  options?: ReactiveWatchOptions,
) {
  React.useEffect(() => {
    // Watch for changes to value
    const handle = when(getValue, callback, { initial: true, ...options });

    // Remove watch when component unmounts
    return () => {
      handle.remove();
    };
  }, [callback, getValue, options]);
}

/**
 * Subscribes to an ArcGIS reactive value and returns its current snapshot.
 *
 * Built on useSyncExternalStore: the watch handle is the subscription and
 * `getValue` is the snapshot, so no effect mirrors state into React and the
 * value is correct on the first render.
 *
 * `getValue` must be referentially stable (memoize it) and must return a
 * stable reference while unchanged — Accessor property reads satisfy this,
 * but freshly-allocated values (e.g. `collection.toArray()`) do not.
 */
export function useWatchValue<T>(getValue: () => T, options?: ReactiveWatchOptions): T {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const handle = watch(getValue, onStoreChange, options);
      return () => handle.remove();
    },
    [getValue, options],
  );

  return React.useSyncExternalStore(subscribe, getValue);
}

export function useWatchState<T>(
  getValue: () => T,
  deps?: unknown[],
  options?: ReactiveWatchOptions,
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  const stableGetValue = React.useCallback(getValue, deps ?? []);

  return useWatchValue(stableGetValue, options);
}

export function useArcState<T extends Accessor, Property extends keyof T>(
  acc: T,
  property: Property,
): [T[Property], React.Dispatch<React.SetStateAction<T[Property]>>] {
  const getValue = React.useCallback(() => acc[property], [acc, property]);
  const state = useWatchValue(getValue);

  const setArcState: React.Dispatch<React.SetStateAction<T[Property]>> = React.useCallback(
    (newValue) => {
      const resolved =
        typeof newValue === 'function'
          ? (newValue as (oldValue: T[Property]) => T[Property])(acc[property])
          : newValue;

      // Write back to the accessor; the watch above propagates it into React.
      acc.set(property as string, resolved);
    },
    [acc, property],
  );

  return [state, setArcState];
}
