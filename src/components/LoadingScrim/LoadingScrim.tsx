import React from 'react';

import { appTwVariants } from '@/lib/helpers/tailwind-utils';

import SpinLoader from '../SpinLoader';

const loadingScrim = appTwVariants({
  base: 'absolute inset-0 h-full w-full place-content-center bg-htmlBackground text-fg opacity-0 transition-[behavior:allow-discrete] duration-[600ms]',
  variants: {
    isLoading: {
      true: 'grid opacity-100',
      false: 'hidden opacity-0',
    },
  },
});

function LoadingScrim({ isLoading, error }: { isLoading: boolean; error?: string }) {
  const [shouldShow, setShouldShow] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: number;
    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        setShouldShow(true);
      }, 100);
    } else {
      setShouldShow(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return (
    <div className={loadingScrim({ isLoading: shouldShow })}>
      {error ? (
        <h2>{`Error initializing map: ${error}`}</h2>
      ) : (
        <SpinLoader className="text-fg" size={140}></SpinLoader>
      )}
    </div>
  );
}

export default LoadingScrim;
