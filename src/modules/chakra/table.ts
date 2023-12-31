import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  table: {},
  thead: {
    tr: {
      bgColor: 'rgb(30, 51, 32) !important',
      position: 'sticky',
      top: '0',
    },
  },
  tbody: {},
  tr: {
    textStyle: 'textSansSmall',
    fontSize: '14px',
    _even: {
      bgColor: 'rgba(42, 96, 47, 0.5)',
    },
    _odd: {
      bgColor: 'rgba(30, 51, 32, 0.5)',
    },
  },
  th: {
    textTransform: 'capitalize',
    fontSize: 'inherit',
    bgColor: 'rgba(45, 150, 154, 0.3)',
  },
  td: {},
});

const main = definePartsStyle({
  td: {
    py: '8px',
    height: '40px',
  },
  th: {
    height: '50px',
    fontSize: '16px',
    fontWeight: '400',
  },
});

export const tableTheme = defineMultiStyleConfig({
  variants: { main },
  baseStyle,
});
