import * as React from 'react';

import { ArcPopupContext } from './ArcPopupContext';

export function useArcPopup() {
  const context = React.useContext(ArcPopupContext);

  if (context === undefined) {
    throw new Error('useArcPopup must be used within an ArcPopupProvider');
  }

  return context;
}
