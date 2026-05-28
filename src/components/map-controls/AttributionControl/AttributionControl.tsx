import { useMergedRef, useResizeObserver } from '@mantine/hooks';
import * as React from 'react';
import { Button, composeRenderProps } from 'react-aria-components';
import { cn, tv } from 'tailwind-variants';

import { focusRing, insetfocusRing } from '@/styles/recipes/focusRing';

import SvgIcon from '../../SvgIcon';

const attributionStyles = tv({
  slots: {
    control:
      'absolute bottom-0 left-0 z-10 flex w-full gap-2 bg-accent-a9 px-3 text-accent-contrast theme-bsk1:bg-gray-12 theme-bsk1:text-gray-1',
    region: 'min-w-0 flex-1',
    toggle: 'min-w-0 flex-1 cursor-pointer text-left outline-white',
    text: 'block text-xs',
    poweredBy: 'text-xs whitespace-nowrap',
    esriLink: 'underline hover:no-underline',
    infoButton: 'shrink-0 cursor-pointer rounded-full opacity-80 outline-white hover:opacity-100',
  },
  variants: {
    isExpanded: {
      false: {
        control: 'h-5 items-center',
        text: 'truncate',
      },
      true: {
        control: 'items-start py-1',
        text: 'break-words whitespace-normal',
      },
    },
  },
});

interface AttributionControlProps {
  attribution?: string;
}

export function AttributionControl({ attribution }: AttributionControlProps): React.ReactElement {
  console.log('AttributionControl', attribution);

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

  const styles = attributionStyles({ isExpanded });

  const text = (
    <span ref={textRef} id={expandedId} className={styles.text()}>
      {attribution}
    </span>
  );

  return (
    <div data-testid="map-attribution" className={styles.control()}>
      {isInteractive ? (
        <Button
          className={composeRenderProps(
            '',
            (className, renderProps) =>
              cn(
                styles.toggle(),
                insetfocusRing({ isFocusVisible: renderProps.isFocusVisible }),
                className,
              ) ?? '',
          )}
          aria-label={isExpanded ? 'Collapse attribution' : 'Expand attribution'}
          aria-expanded={isExpanded}
          aria-controls={expandedId}
          onPress={() => setIsExpanded((expanded) => !expanded)}
        >
          {text}
        </Button>
      ) : (
        <p className={styles.region()}>{text}</p>
      )}

      <div className="flex items-center gap-2">
        {showPoweredBy && (
          <span id={poweredById} className={styles.poweredBy()}>
            Powered by{' '}
            <a
              className={styles.esriLink()}
              href="https://www.esri.com"
              target="_blank"
              rel="noreferrer"
            >
              Esri
            </a>
          </span>
        )}
        <Button
          className={composeRenderProps(
            '',
            (className, renderProps) =>
              cn(
                styles.infoButton(),
                focusRing({ isFocusVisible: renderProps.isFocusVisible }),
                className,
              ) ?? '',
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
