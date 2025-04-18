import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PropertyDatabase from './pages/PropertyDatabase';
import ROICalculator from './pages/ROICalculator';
import DocumentGenerator from './pages/DocumentGenerator';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box as="main" p={0}>
        <Routes>
          {/* Show the new HomePage at the root path */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<PropertyDatabase />} />
          <Route path="/roi" element={<ROICalculator />} />
          <Route path="/documents" element={<DocumentGenerator />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 