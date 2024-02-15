import { Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';

type TipProps = {
  text: string;
  width?: string;
  append?: JSX.Element;
};
export const Tip = ({ text, width, append }: TipProps) => {
  return (
    <Popover trigger="hover" placement="top">
      <PopoverTrigger>
        <Flex
          cursor="pointer"
          w="17px"
          h="17px"
          borderRadius="50%"
          bgColor="gray.200"
          alignItems="center"
          justifyContent="center"
          fontSize="12px"
        >
          i
        </Flex>
      </PopoverTrigger>
      <PopoverContent bgColor="gray.200" padding="20px" width={width}>
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
