import Viewpoint from '@arcgis/core/Viewpoint';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useArcState, useWatchState } from './useWatchEffect';

describe('useWatchState', () => {
  it('returns the current value on the first render', () => {
    const viewpoint = new Viewpoint({ scale: 1000 });
    const renders: number[] = [];

    renderHook(() => {
      const scale = useWatchState(() => viewpoint.scale, [viewpoint]);
      renders.push(scale);
    });

    expect(renders[0]).toBe(1000);
  });

  it('re-renders when the watched property changes', async () => {
    const viewpoint = new Viewpoint({ scale: 1000 });

    const { result } = renderHook(() => useWatchState(() => viewpoint.scale, [viewpoint]));

    act(() => {
      viewpoint.scale = 2000;
    });

    await waitFor(() => expect(result.current).toBe(2000));
  });
});

describe('useArcState', () => {
  it('writes back to the accessor and reflects the new value', async () => {
    const viewpoint = new Viewpoint({ rotation: 0 });

    const { result } = renderHook(() => useArcState(viewpoint, 'rotation'));

    act(() => {
      result.current[1](45);
    });

    expect(viewpoint.rotation).toBe(45);
    await waitFor(() => expect(result.current[0]).toBe(45));
  });

  it('resolves functional updates against the accessor value', async () => {
    const viewpoint = new Viewpoint({ rotation: 10 });

    const { result } = renderHook(() => useArcState(viewpoint, 'rotation'));

    act(() => {
      result.current[1]((rotation) => rotation + 5);
    });

    expect(viewpoint.rotation).toBe(15);
    await waitFor(() => expect(result.current[0]).toBe(15));
  });
});
