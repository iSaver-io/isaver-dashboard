import { forwardRef } from 'react';
import { Button as ChButton, ButtonProps, Flex } from '@chakra-ui/react';

/*
 * You need to use this button  instead of ChakraUI Button to prevent error with Google translate
 * especially when using isLoading button state
 * @see: https://github.com/facebook/react/issues/11538
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  return (
    <ChButton {...props} ref={ref}>
      <Flex width="100%" alignItems="center" justifyContent="center">
        {children}
      </Flex>
    </ChButton>
  );
});
