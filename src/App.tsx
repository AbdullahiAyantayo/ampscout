import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import PropertyDatabase from './pages/PropertyDatabase';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const mainPadding = useBreakpointValue({ base: 0, md: 0 });
  
  return (
    <Box minH="100vh" width="100%" overflowX="hidden">
      <Navbar />
      <Box 
        as="main" 
        p={mainPadding}
        width="100%"
      >
        <Routes>
          {/* Show the new HomePage at the root path */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertyDatabase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 