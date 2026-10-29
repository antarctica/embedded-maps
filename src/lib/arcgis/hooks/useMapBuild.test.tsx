import EsriMap from '@arcgis/core/Map';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { MapCommand, ViewCommand } from '../typings/commandtypes';
import { useMapBuild } from './useMapBuild';

function StrictWrapper({ children }: React.PropsWithChildren): React.ReactElement {
  return <React.StrictMode>{children}</React.StrictMode>;
}

describe('useMapBuild', () => {
  it('builds the map once under StrictMode', async () => {
    const createMap = vi.fn(() => new EsriMap());
    const command: MapCommand = { executeOnMap: vi.fn(async () => undefined) };
    const commands = [command];

    const { result } = renderHook(() => useMapBuild(commands, createMap), {
      wrapper: StrictWrapper,
    });

    expect(result.current.isMapLoading).toBe(true);
    await waitFor(() => expect(result.current.isMapLoading).toBe(false));

    expect(createMap).toHaveBeenCalledTimes(1);
    expect(command.executeOnMap).toHaveBeenCalledTimes(1);
    expect(result.current.map).toBe(createMap.mock.results[0]?.value);
  });

  it('collects view commands and keeps building after a failing command', async () => {
    const viewCommand: ViewCommand = { executeOnView: vi.fn() };
    const failure = new Error('layer failed');
    const commands: MapCommand[] = [
      { executeOnMap: async () => viewCommand },
      {
        executeOnMap: async () => {
          throw failure;
        },
      },
      { executeOnMap: async () => viewCommand },
    ];

    const { result } = renderHook(() => useMapBuild(commands, () => new EsriMap()));

    await waitFor(() => expect(result.current.isMapLoading).toBe(false));

    expect(result.current.postInitCommands).toEqual([viewCommand, viewCommand]);
    expect(result.current.error).toBe(failure);
  });

  it('waits while commands are undefined', () => {
    const createMap = vi.fn(() => new EsriMap());

    const { result } = renderHook(() => useMapBuild(undefined, createMap));

    expect(result.current.isMapLoading).toBe(true);
    expect(result.current.map).toBeNull();
    expect(createMap).not.toHaveBeenCalled();
  });
});
