import { ArcViewContext } from '@/arcgis/contexts/ArcViewContext/ArcViewContext';
import { ArcInternalViewProvider } from '@/arcgis/contexts/InternalViewContext/ArcInternalViewProvider';

export const withInternalViewProvider = ({
  mapView,
}: {
  mapView: __esri.MapView | __esri.SceneView;
}) => {
  const withMapProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return <ArcInternalViewProvider view={mapView}>{children}</ArcInternalViewProvider>;
  };

  return withMapProviderWrapper;
};

export const withMountedViewsProvider = ({
  mapview,
  id,
}: {
  mapview: __esri.MapView | __esri.SceneView;
  id: string;
}) => {
  const withMountedViewsProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ArcViewContext.Provider
        value={{
          views: { [id]: mapview },
          onViewMount: () => {},
          onViewUnmount: () => {},
        }}
      >
        {children}
      </ArcViewContext.Provider>
    );
  };
  return withMountedViewsProviderWrapper;
};
