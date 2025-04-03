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
  { icon: Icon, className, ...restProps }: IconButtonProps,
  ref,
) {
  return (
    <ButtonPrimitive
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) => {
        const [recipeProps] = buttonRecipe.splitVariantProps({ ...restProps, ...renderProps });
        return cx(buttonRecipe(recipeProps), className);
      })}
      {...restProps}
    >
      {Icon}
    </ButtonPrimitive>
  );
});
