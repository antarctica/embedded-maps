import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import * as React from 'react';

import { useViews, useWatchState } from '@/lib/arcgis/hooks';

import { AttributionControl } from './AttributionControl';

type View = MapView | SceneView;

function combineAttribution(views: View[]): string {
  const texts = new Set<string>();
  for (const view of views) {
    view.attributionItems.forEach((item) => texts.add(item.text));
  }
  return Array.from(texts).join(' | ');
}

/**
 * Watches every mounted view (e.g. the main MapView and the Globe SceneView) and
 * feeds their combined, de-duplicated attribution into the presentational
 * AttributionControl.
 *
 * Each view's `attributionItems` is a reactive Collection. Reading it inside the
 * watched getter (via `forEach`) tracks both collection-level changes (items
 * added/removed) and each item's `text`, so the value updates whenever the
 * underlying attribution changes — no need to proxy through `view.updating`.
 * The combined value is a string, so it is a stable snapshot between changes.
 */
export function CombinedAttributionControl({
  ref,
}: {
  ref?: React.Ref<HTMLDivElement>;
}): React.ReactElement {
  const views = useViews();
  const liveViews = React.useMemo(
    () => Object.values(views).filter((v): v is View => !!v),
    [views],
  );
  const attribution = useWatchState(() => combineAttribution(liveViews), [liveViews]);

  return <AttributionControl ref={ref} attribution={attribution} />;
}
