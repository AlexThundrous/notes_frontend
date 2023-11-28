import React from 'react';
import { Flex, Input, Box, useColorMode } from '@chakra-ui/react';

const SearchBox = ({ onSearchChange }) => {
  const { colorMode } = useColorMode()
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'yellow.300';

  return (
    <Flex justify="center" align="flex-start">
      <Box
        p={4}
        mb={'4rem'}
        borderRadius="md"
        width={{base: "25rem", md:"50rem"}}
      >
        <Input
          type="search"
          placeholder="Search notes..."
          onChange={(e) => onSearchChange(e.target.value)}
          borderRadius="full"
          border="4px solid"
          borderColor={borderColor}
        />
      </Box>
    </Flex>
  );
};

export default SearchBox;
