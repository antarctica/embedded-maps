import * as symbolUtils from '@arcgis/core/symbols/support/symbolUtils';

export interface SymbolDimensions {
  width: number;
  height: number;
}

/**
 * Renders a symbol to HTML using ArcGIS symbol utilities
 */
export async function renderPreviewHTML(symbol: __esri.SymbolUnion, size: number) {
  if (symbol.type === 'cim' || symbol.type === 'picture-marker' || symbol.type === 'picture-fill') {
    return symbolUtils.renderPreviewHTML(symbol, {
      size: {
        width: size,
        height: size,
      },
    });
  } else {
    return symbolUtils.renderPreviewHTML(symbol);
  }
}

/**
 * Creates a zigzag path for line symbols
 * @param size - Size of the preview area
 * @param padding - Padding within the preview area
 * @returns SVG path data for zigzag pattern
 */
export function createZigzagPath(size: number, padding: number): string {
  const zigzagWidth = size - padding * 2;
  const zigzagHeight = size * 0.2; // Use 20% of height to ensure it fits
  const segmentWidth = zigzagWidth / 3; // 3 segments for a more compact zigzag

  // Start at the leftmost point
  let path = `M ${padding} ${-zigzagHeight / 2}`;

  // Add segments to create zigzag pattern
  for (let i = 1; i <= 3; i++) {
    const x = padding + i * segmentWidth;
    const y = i % 2 === 0 ? -zigzagHeight / 2 : zigzagHeight / 2;
    path += ` L ${x} ${y}`;
  }

  return path;
}

/**
 * Processes SVG content for simple line symbols by replacing paths with zigzag patterns
 */
export function processSvgContentForLineSymbol(
  svgContent: string,
  symbol: __esri.Symbol,
  width: number,
  padding: number,
): string {
  if (symbol.type === 'simple-line') {
    const zigzagPath = createZigzagPath(width, padding);
    return svgContent.replace(/d="[^"]*"/g, `d="${zigzagPath}"`);
  }
  return svgContent;
}

/**
 * Extracts dimensions from an HTML image element
 */
export function extractImageDimensions(imageElement: HTMLImageElement): SymbolDimensions {
  return {
    width: imageElement.width,
    height: imageElement.height,
  };
}

/**
 * Extracts dimensions from an SVG element
 */
export function extractSvgDimensions(svgElement: Element): SymbolDimensions {
  const width = parseFloat(svgElement.getAttribute('width') || '0');
  const height = parseFloat(svgElement.getAttribute('height') || '0');
  return { width, height };
}

/**
 * Calculates the scale factor to fit content within circular bounds
 */
export function calculateScaleFactor(
  originalSize: SymbolDimensions,
  containerSize: number,
  padding: number,
): number {
  const availableDiameter = containerSize - 2 * padding;
  return (
    availableDiameter /
    Math.sqrt(originalSize.width * originalSize.width + originalSize.height * originalSize.height)
  );
}

/**
 * Creates SVG image element content from HTML image
 */
export function createImageSvgContent(imageElement: HTMLImageElement): string {
  return `<image href="${imageElement.src}" width="${imageElement.width}" height="${imageElement.height}" />`;
}
