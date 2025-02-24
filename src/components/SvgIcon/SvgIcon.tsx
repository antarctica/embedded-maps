import { css, cx } from '@styled-system/css';
import React from 'react';

import { IconName } from '@/types/Icons';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  color?: string;
  inline?: boolean;
}

const SvgIcon: React.FC<IconProps> = React.forwardRef<SVGSVGElement, IconProps>(
  (
    { name, size = 12, color = 'currentColor', className, style, inline = false, ...props },
    ref,
  ) => (
    <svg
      aria-hidden
      ref={ref}
      className={cx(css({ userSelect: 'none' }), className)}
      width={size}
      height={size}
      fill={color}
      style={{
        ...style,
        display: inline ? 'inline-block' : 'block',
        verticalAlign: 'middle',
        marginInlineEnd: inline ? '0.25rem' : '0',
      }}
      {...props}
    >
      <use xlinkHref={`/svg/sprites.svg#${name}`} />
    </svg>
  ),
);

export default SvgIcon;
