import * as React from 'react';

import { ArcPopupContext } from './ArcPopupContext';

export function ArcPopupProvider({ children }: React.PropsWithChildren): React.ReactElement {
  const popupRef = React.useRef<HTMLArcgisPopupElement | null>(null);

  const onPopupMount = React.useCallback((popup: HTMLArcgisPopupElement) => {
    popupRef.current = popup;
  }, []);

  const value = React.useMemo(() => ({ popupRef, onPopupMount }), [onPopupMount]);

  return <ArcPopupContext.Provider value={value}>{children}</ArcPopupContext.Provider>;
}
