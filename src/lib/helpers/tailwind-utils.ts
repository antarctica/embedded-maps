import clsx from 'clsx';
import { composeRenderProps } from 'react-aria-components';
import { extendTailwindMerge } from 'tailwind-merge';
import { type ClassValue, createTV } from 'tailwind-variants';

import { generatedThemeConfig } from './tailwind-theme.gen.ts';

const config = generatedThemeConfig;

export const customTwMerge = extendTailwindMerge(config);

export const appTwVariants = createTV({
  twMergeConfig: config,
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => customTwMerge(tw, className));
}
