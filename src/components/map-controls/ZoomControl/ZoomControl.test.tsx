import MapView from '@arcgis/core/views/MapView';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { fireEvent, render } from '@testing-library/react';

import { withInternalViewProvider } from '@/test/ProviderMocks/MapProviderMock';

import ZoomControl from './ZoomControl';

vi.mock('@arcgis/core/widgets/Zoom/ZoomViewModel');
vi.mock('@arcgis/core/views/MapView');

describe('ZoomControl', () => {
  let mapView: __esri.MapView;
  let zoomVM: __esri.ZoomViewModel;

  beforeEach(() => {
    mapView = new MapView();
    zoomVM = new ZoomViewModel();
  });

  it('render Zoom Control Component', () => {
    const view = render(<ZoomControl />, {
      wrapper: withInternalViewProvider({ mapView }),
    });

    // get the zoom buttons
    const zoomInButton = view.getByRole('button', { name: 'Zoom In' });
    const zoomOutButton = view.getByRole('button', { name: 'Zoom Out' });

    fireEvent.click(zoomInButton);
    expect(zoomVM.zoomIn).toHaveBeenCalled();

    fireEvent.click(zoomOutButton);
    expect(zoomVM.zoomOut).not.toHaveBeenCalled();
  });
});
