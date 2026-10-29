import * as React from 'react';

type ArcPopupContextValue = {
  popupRef: React.RefObject<HTMLArcgisPopupElement | null>;
  onPopupMount: (popup: HTMLArcgisPopupElement) => void;
};

export const ArcPopupContext = React.createContext<ArcPopupContextValue | undefined>(undefined);
