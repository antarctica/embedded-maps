import React from 'react';
import { tv } from 'tailwind-variants';

import SpinLoader from '../SpinLoader';

const loadingScrim = tv({
  slots: {
    root: 'absolute inset-0 h-full w-full place-content-center bg-htmlBackground text-fg opacity-0 transition-[behavior:allow-discrete] duration-[600ms]',
    spinner: 'text-fg',
    error: 'text-fg',
  },
  variants: {
    isLoading: {
      true: {
        root: 'grid opacity-100',
      },
      false: {
        root: 'hidden opacity-0',
      },
    },
  },
});

function LoadingScrim({ isLoading, error }: { isLoading: boolean; error?: string }) {
  const [debounceElapsed, setDebounceElapsed] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setDebounceElapsed(true);
    }, 100);
    return () => {
      clearTimeout(timeoutId);
      setDebounceElapsed(false);
    };
  }, [isLoading]);

  const shouldShow = isLoading && debounceElapsed;
  const styles = loadingScrim({ isLoading: shouldShow });

  return (
    <div className={styles.root()}>
      {error ? (
        <h2 className={styles.error()}>{`Error initializing map: ${error}`}</h2>
      ) : (
        <SpinLoader className={styles.spinner()} size={140}></SpinLoader>
      )}
    </div>
  );
}

export default LoadingScrim;
