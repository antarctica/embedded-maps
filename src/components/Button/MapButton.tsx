import { css } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import { IconButton, IconButtonProps } from './IconButton';

export function MapButton(
  props: Omit<IconButtonProps, 'className'> & {
    includeBorder?: boolean;
  },
) {
  if (props.includeBorder) {
    return (
      <Box
        className={css({
          borderColor: 'grayscale.400',
          borderWidth: 'thin',
          bg: 'grayscale.200',
          boxShadow: 'md',
        })}
      >
        <IconButton
          {...props}
          className={css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            md: {
              w: '10',
              h: '10',
            },
            mdDown: {
              w: '8',
              h: '8',
            },
          })}
        />
      </Box>
    );
  }

  return (
    <IconButton
      {...props}
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        md: {
          w: '10',
          h: '10',
        },
        mdDown: {
          w: '8',
          h: '8',
        },
      })}
      style={{ padding: 0 }}
    />
  );
}
