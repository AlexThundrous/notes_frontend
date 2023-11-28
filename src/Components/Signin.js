import React from 'react';
import { Flex, Text, Button, Box } from '@chakra-ui/react';

function SignIn() {
  const handleSignIn = () => {
    window.location.href = "https://protected-peak-20722-b8ffb97d9c03.herokuapp.com/auth/google";
  };
  
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Sign In
        </Text>
        <Button colorScheme="teal" onClick={handleSignIn} width="100%">
          Sign In with Google
        </Button>
      </Box>
    </Flex>
  );
}

export default SignIn;
