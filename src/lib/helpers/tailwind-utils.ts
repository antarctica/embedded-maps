import { composeRenderProps } from 'react-aria-components';
import type { ClassValue } from 'tailwind-variants';
import { cn, defaultConfig } from 'tailwind-variants';

import { generatedThemeConfig } from './tailwind-theme.gen.ts';

export function setupTailwindVariants() {
  defaultConfig.twMergeConfig = generatedThemeConfig;
}

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string | ClassValue,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => cn(className, tw) ?? '');
}
