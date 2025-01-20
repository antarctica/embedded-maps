import { vi } from 'vitest';

const MapView = vi.fn();
MapView.prototype.goTo = vi.fn().mockResolvedValue(true);
MapView.prototype.when = vi.fn().mockResolvedValue(true);

export default MapView;
