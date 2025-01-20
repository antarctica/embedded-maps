'use client';

import { cx, RecipeVariantProps } from '@styled-system/css';
import React from 'react';
import { Button as ButtonPrimitive, composeRenderProps } from 'react-aria-components';

import { buttonRecipe } from './buttonRecipe';

export type IconButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  RecipeVariantProps<typeof buttonRecipe> & {
    className?: string;
  } & {
    icon: React.ReactNode;
    'aria-label': string;
  };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function Button(
  { icon: Icon, className, isDisabled, size = 'lg', ...restProps }: IconButtonProps,
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        cx(buttonRecipe({ ...renderProps, size, IconButton: true }), className),
      )}
      isDisabled={isDisabled}
      {...restProps}
    >
      {Icon}
    </ButtonPrimitive>
  );
});
