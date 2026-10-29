import { Separator } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const dividerRecipe = tv({
  base: 'border-none bg-gray-3',
  variants: {
    orientation: {
      vertical: 'h-full w-[1px]',
      horizontal: 'h-[1px] w-full',
    },
  },
});

export function Divider(props: { orientation: 'vertical' | 'horizontal'; className?: string }) {
  return (
    <Separator
      orientation={props.orientation}
      className={dividerRecipe({ orientation: props.orientation, className: props.className })}
    />
  );
}
