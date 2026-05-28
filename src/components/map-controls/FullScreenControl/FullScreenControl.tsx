import { useFullscreenDocument } from '@mantine/hooks';
import * as React from 'react';

import { IconButton } from '../../Button/IconButton';
import SvgIcon from '../../SvgIcon';

function FullScreenControl(): React.ReactElement {
  const { toggle, fullscreen } = useFullscreenDocument();

  return (
    <IconButton
      icon={<SvgIcon name="icon-fullscreen" />}
      aria-label={fullscreen ? 'Exit Full Screen' : 'Full Screen'}
      isDisabled={!document.fullscreenEnabled}
      onPress={() => void toggle()}
      variant="mapButton"
      size="md"
    />
  );
}

export default FullScreenControl;
