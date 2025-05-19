'use client';

import React from 'react';
import { Button as ButtonPrimitive, composeRenderProps } from 'react-aria-components';
import { type VariantProps } from 'tailwind-variants';

import { buttonRecipe } from './buttonRecipe';

export type IconButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonRecipe> & {
    className?: string;
  } & {
    icon: React.ReactNode;
    'aria-label': string;
  };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function Button(
  { icon: Icon, className, ...restProps }: IconButtonProps,
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) => {
        return buttonRecipe({ ...restProps, ...renderProps, className });
      })}
      {...restProps}
    >
      {Icon}
    </ButtonPrimitive>
  );
});
