export interface RendererSymbolInfo {
  label: string;
  symbol: __esri.Symbol;
}

function isSimpleRenderer(renderer: __esri.Renderer): renderer is __esri.SimpleRenderer {
  return renderer.type === 'simple';
}

function isUniqueValueRenderer(renderer: __esri.Renderer): renderer is __esri.UniqueValueRenderer {
  return renderer.type === 'unique-value';
}

function getSimpleRendererSymbols(renderer: __esri.SimpleRenderer): RendererSymbolInfo[] {
  if (!renderer.symbol) return [];
  return [{ label: renderer.label ?? '', symbol: renderer.symbol }];
}

function getUniqueValueRendererSymbols(renderer: __esri.UniqueValueRenderer): RendererSymbolInfo[] {
  const results: RendererSymbolInfo[] = [];
  const infos = renderer.uniqueValueInfos ?? [];
  for (const info of infos) {
    if (!info.symbol) continue;
    results.push({ label: info.label ?? '', symbol: info.symbol });
  }
  if (renderer.defaultSymbol) {
    results.push({ label: renderer.defaultLabel ?? 'Other', symbol: renderer.defaultSymbol });
  }
  return results;
}

/**
 * Returns all symbols and their associated labels for supported renderer types (SimpleRenderer, UniqueValueRenderer).
 * If the renderer is not supported, returns an empty array and logs a warning.
 */
export function getRendererSymbols(renderer: __esri.Renderer): RendererSymbolInfo[] {
  if (isSimpleRenderer(renderer)) {
    return getSimpleRendererSymbols(renderer);
  }
  if (isUniqueValueRenderer(renderer)) {
    return getUniqueValueRendererSymbols(renderer);
  }

  console.warn('getRendererSymbols: Unsupported renderer type', renderer.type);
  return [];
}
