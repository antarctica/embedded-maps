import { vi } from 'vitest';

const ZoomViewModel = vi.fn();
ZoomViewModel.prototype.zoomIn = vi.fn();
ZoomViewModel.prototype.zoomOut = vi.fn();
ZoomViewModel.prototype.canZoomIn = true;
ZoomViewModel.prototype.canZoomOut = false;
ZoomViewModel.prototype.state = 'ready';
export default ZoomViewModel;
