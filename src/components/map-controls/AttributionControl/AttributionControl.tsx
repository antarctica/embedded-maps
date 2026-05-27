import { useMergedRef, useResizeObserver } from '@mantine/hooks';
import * as React from 'react';
import { Button, composeRenderProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusRing, insetfocusRing } from '@/styles/recipes/focusRing';

import SvgIcon from '../../SvgIcon';

const attributionControl = tv({
  base: 'absolute bottom-0 left-0 z-10 flex w-full gap-2 bg-accent-a9 px-3 text-accent-contrast theme-bsk1:bg-gray-12 theme-bsk1:text-gray-1',
  variants: {
    isExpanded: {
      false: 'h-5 items-center',
      true: 'items-start py-1',
    },
  },
});

const attributionRegion = tv({
  base: 'min-w-0 flex-1',
});

const attributionToggle = tv({
  extend: insetfocusRing,
  base: 'min-w-0 flex-1 cursor-pointer text-left outline-white',
});

const attributionText = tv({
  base: 'block text-xs',
  variants: {
    isExpanded: {
      false: 'truncate',
      true: 'break-words whitespace-normal',
    },
  },
});

const poweredBy = tv({
  base: 'text-xs whitespace-nowrap',
});

const esriLink = tv({
  base: 'underline hover:no-underline',
});

const infoButton = tv({
  extend: focusRing,
  base: 'shrink-0 cursor-pointer rounded-full opacity-80 outline-white hover:opacity-100',
});

interface AttributionControlProps {
  attribution?: string;
}

export function AttributionControl({ attribution }: AttributionControlProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [showPoweredBy, setShowPoweredBy] = React.useState(false);
  const elementRef = React.useRef<HTMLSpanElement>(null);
  const [resizeRef, rect] = useResizeObserver<HTMLSpanElement>();
  const textRef = useMergedRef(resizeRef, elementRef);

  const internalId = React.useId();
  const expandedId = `map-attribution-names-${internalId}`;
  const poweredById = `powered-by-esri-${internalId}`;

  // Only offer the expand control when the single-line text is actually clipped.
  const isInteractive = isOverflowing || isExpanded;

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    setIsOverflowing(element.scrollWidth > element.clientWidth);
  }, [attribution, isExpanded, rect.width]);

  const text = (
    <span ref={textRef} id={expandedId} className={attributionText({ isExpanded })}>
      {attribution}
    </span>
  );

  return (
    <div className={attributionControl({ isExpanded })}>
      {isInteractive ? (
        <Button
          className={composeRenderProps('', (className, renderProps) =>
            attributionToggle({ ...renderProps, className }),
          )}
          aria-label={isExpanded ? 'Collapse attribution' : 'Expand attribution'}
          aria-expanded={isExpanded}
          aria-controls={expandedId}
          onPress={() => setIsExpanded((expanded) => !expanded)}
        >
          {text}
        </Button>
      ) : (
        <p className={attributionRegion()}>{text}</p>
      )}

      <div className="flex items-center gap-2">
        {showPoweredBy && (
          <span id={poweredById} className={poweredBy()}>
            Powered by{' '}
            <a className={esriLink()} href="https://www.esri.com" target="_blank" rel="noreferrer">
              Esri
            </a>
          </span>
        )}
        <Button
          className={composeRenderProps('', (className, renderProps) =>
            infoButton({ ...renderProps, className }),
          )}
          aria-label={showPoweredBy ? 'Hide Esri attribution' : 'Show Esri attribution'}
          aria-expanded={showPoweredBy}
          aria-controls={poweredById}
          onPress={() => setShowPoweredBy((shown) => !shown)}
        >
          <SvgIcon name="icon-info" size={16} />
        </Button>
      </div>
    </div>
  );
}
