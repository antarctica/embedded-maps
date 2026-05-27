import * as React from 'react';

import { useViews, useWhenEffect } from '@/lib/arcgis/hooks';

import { AttributionControl } from './AttributionControl';

// Stable reference so useWhenEffect doesn't re-subscribe on every render.
const WHEN_SETTLED = { initial: true };

/**
 * Watches every mounted view (e.g. the main MapView and the Globe SceneView) and
 * feeds their combined, de-duplicated attribution into the presentational
 * AttributionControl.
 *
 * `View.attributionItems` is only finalised once a view has finished updating, so
 * — following Esri's recommended `when(() => !view.updating)` pattern — the text is
 * recomputed when every mounted view is settled rather than on every reactive
 * change during pan/zoom.
 */
export function CombinedAttributionControl(): React.ReactElement {
  const views = useViews();
  const [attribution, setAttribution] = React.useState<string>();

  const allViewsSettled = React.useCallback(
    () => Object.values(views).every((view) => !view || !view.updating),
    [views],
  );

  const combineAttribution = React.useCallback(() => {
    const texts = new Set<string>();
    for (const view of Object.values(views)) {
      if (!view) continue;
      view.attributionItems.forEach((item) => texts.add(item.text));
    }
    setAttribution(Array.from(texts).join(' | '));
  }, [views]);

  useWhenEffect(allViewsSettled, combineAttribution, WHEN_SETTLED);

  return <AttributionControl attribution={attribution} />;
}
