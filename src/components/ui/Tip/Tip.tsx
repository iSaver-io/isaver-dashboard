import {
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpoint,
} from '@chakra-ui/react';

type TipProps = {
  text: string;
  width?: string;
  append?: JSX.Element;
};
export const Tip = ({ text, width, append }: TipProps) => {
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md'].includes(bp);

  return (
    <Popover trigger={isSm ? 'click' : 'hover'} placement="top">
      <PopoverTrigger>
        <Button
          padding="0"
          minW="unset"
          cursor="pointer"
          w="17px"
          h="17px"
          borderRadius="50%"
          bgColor="gray.200"
          alignItems="center"
          justifyContent="center"
          fontSize="12px"
          textTransform="lowercase"
        >
          i
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bgColor="gray.200"
        padding="20px"
        margin="0 15px"
        maxWidth="290px"
        _focusVisible={{ outline: 'unset' }}
      >
        <PopoverBody color="white" padding="0" fontSize="12px">
          {text}

          {append ? (
            <Flex mt="10px" justifyContent="center">
              {append}
            </Flex>
          ) : null}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};