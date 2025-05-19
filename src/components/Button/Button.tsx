'use client';

import React from 'react';
import { Button as ButtonPrimitive, composeRenderProps } from 'react-aria-components';
import { type VariantProps } from 'tailwind-variants';

import { buttonRecipe } from './buttonRecipe';

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonRecipe> & {
    className?: string;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, isDisabled, size = 'lg', children, ...restProps }: ButtonProps,
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        buttonRecipe({ ...renderProps, size, className }),
      )}
      isDisabled={isDisabled}
      {...restProps}
    >
      {children}
    </ButtonPrimitive>
  );
});

export default Button;
