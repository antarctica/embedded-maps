import { useSeparator } from 'react-aria';

import { appTwVariants } from '@/lib/helpers/tailwind-utils';

const dividerRecipe = appTwVariants({
  base: 'bg-gray-3',
  variants: {
    orientation: {
      vertical: 'h-full w-[1px]',
      horizontal: 'h-[1px] w-full',
    },
  },
});
export function Divider(props: { orientation: 'vertical' | 'horizontal'; className?: string }) {
  const { separatorProps } = useSeparator(props);

  return (
    <div
      className={dividerRecipe({ orientation: props.orientation, className: props.className })}
      {...separatorProps}
    />
  );
}
