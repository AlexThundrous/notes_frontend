import React, { useState } from 'react';
import { Routes, Route, HashRouter} from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Grid,
} from '@chakra-ui/react';
import { ColorModeSwitcher, customTheme } from './ColorModeSwitcher';
import Notes from './Components/Notes';
import SignIn from './Components/Signin';
import SearchBox from './Components/Searchbox'; // Import the SearchBox component

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  return (
    <ChakraProvider theme={customTheme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={<SignIn />}
              />
              <Route
                path="/home/:googleId"
                element={
                  <Box mb={'13rem'}>
                    <SearchBox onSearchChange={handleSearchChange} />
                    <Notes searchTerm={searchTerm} />
                  </Box>
                }
              />
            </Routes>
          </HashRouter>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
