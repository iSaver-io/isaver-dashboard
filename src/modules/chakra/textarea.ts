import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  textStyle: 'textSansBold',
  fontSize: '18px',
  _placeholder: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const primary = defineStyle({
  background: 'rgb(38, 71, 55)',
  boxShadow: '0px 6px 11px rgba(0, 0, 0, 0.25)',
  borderRadius: 'md',
});

export const textareaTheme = defineStyleConfig({
  variants: { primary },
  defaultProps: { variant: 'primary' },
  baseStyle,
});
