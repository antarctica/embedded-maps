import React from 'react';

type IconName =
  | 'icon-add'
  | 'icon-calendar'
  | 'icon-chevron-down'
  | 'icon-chevron-up'
  | 'icon-chevron-right'
  | 'icon-chevron-left'
  | 'icon-circle'
  | 'icon-double-left-arrow'
  | 'icon-double-right-arrow'
  | 'icon-download'
  | 'icon-filter'
  | 'icon-home'
  | 'icon-icechart'
  | 'icon-image'
  | 'icon-menu'
  | 'icon-more'
  | 'icon-search-globe'
  | 'icon-subtract'
  | 'icon-x'
  | 'icon-antarctic-globe'
  | 'icon-arctic-globe'
  | 'icon-hamburger'
  | 'icon-met-globe'
  | 'icon-navigate'
  | 'icon-no-navigate'
  | 'icon-layers'
  | 'icon-properties'
  | 'icon-add-layer'
  | 'icon-page-share'
  | 'icon-zoom-to'
  | 'icon-check-circle';

interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SvgIcon: React.FC<IconProps> = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 12, color = 'currentColor', className, style }, ref) => (
    <svg ref={ref} className={className} width={size} height={size} fill={color} style={style}>
      <use xlinkHref={`/v1/svg/sprites.svg#${name}`} />
    </svg>
  ),
);

export default SvgIcon;
