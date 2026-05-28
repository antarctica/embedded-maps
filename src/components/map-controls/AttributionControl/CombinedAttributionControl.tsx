import { watch } from '@arcgis/core/core/reactiveUtils';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import * as React from 'react';

import { useViews } from '@/lib/arcgis/hooks';

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
 * Each view's `attributionItems` is a reactive Collection. Reading it inside a
 * `watch` getter (via `forEach`/`map`) tracks both collection-level changes
 * (items added/removed) and each item's `text`, so the callback re-runs whenever
 * the underlying attribution changes — no need to proxy through `view.updating`.
 */
export function CombinedAttributionControl(): React.ReactElement {
  const views = useViews();
  const [attribution, setAttribution] = React.useState<string>('');

  React.useEffect(() => {
    const liveViews = Object.values(views).filter((v): v is View => !!v);
    const recompute = () => setAttribution(combineAttribution(liveViews));

    const handles = liveViews.map((view) =>
      watch(() => view.attributionItems.map((item) => item.text), recompute, {
        initial: true,
      }),
    );

    return () => handles.forEach((handle) => handle.remove());
  }, [views]);

  return <AttributionControl attribution={attribution} />;
}
