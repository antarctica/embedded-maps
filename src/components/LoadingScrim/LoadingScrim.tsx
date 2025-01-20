import { cva } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import SpinLoader from '../SpinLoader';

const loadingScrim = cva({
  base: {
    position: 'absolute',
    inset: '0',
    width: 'full',
    height: 'full',
    color: 'aircraftRed',
    bg: 'htmlBackground',
    opacity: 0,
    transition: 'all',
    transitionDuration: '[600ms]',
    placeContent: 'center',
    transitionBehavior: 'allow-discrete',
  },
  variants: {
    isLoading: {
      true: {
        display: 'grid',
        opacity: '1',
      },
      false: {
        display: 'none',
        opacity: '0',
      },
    },
  },
});
function LoadingScrim({ isLoading, error }: { isLoading: boolean; error?: string }) {
  return (
    <Box className={loadingScrim({ isLoading })}>
      {error ? <h2>{`Error initializing map: ${error}`}</h2> : <SpinLoader size={100}></SpinLoader>}
    </Box>
  );
}

export default LoadingScrim;
