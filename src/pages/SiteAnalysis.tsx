import React, { useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  VStack,
  HStack,
  Select,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import Map from '../components/Map';

const SiteAnalysis: React.FC = () => {
  const [propertyType, setPropertyType] = useState('');
  const [minLotSize, setMinLotSize] = useState(5000);
  const [zoning, setZoning] = useState('');

  const handleAnalyze = () => {
    // Implement analysis logic
    console.log('Analyzing with params:', { propertyType, minLotSize, zoning });
  };

  return (
    <Box>
      <Heading mb={6}>Site Analysis</Heading>
      
      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" height="600px">
          <Map />
        </Box>

        <VStack spacing={4} align="stretch">
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Heading size="md" mb={4}>Analysis Parameters</Heading>
            
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Property Type</FormLabel>
                <Select
                  placeholder="Select property type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="retail">Retail</option>
                  <option value="parking">Parking Lot</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Minimum Lot Size (sq ft)</FormLabel>
                <Slider
                  value={minLotSize}
                  min={1000}
                  max={50000}
                  step={1000}
                  onChange={(val) => setMinLotSize(val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text mt={2} fontSize="sm" color="gray.600">
                  {minLotSize.toLocaleString()} sq ft
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Zoning</FormLabel>
                <Select
                  placeholder="Select zoning type"
                  value={zoning}
                  onChange={(e) => setZoning(e.target.value)}
                >
                  <option value="B4">B4 - General Business</option>
                  <option value="M1">M1 - Limited Industrial</option>
                  <option value="M2">M2 - Restricted Industrial</option>
                  <option value="M3">M3 - General Industrial</option>
                </Select>
              </FormControl>

              <Button colorScheme="brand" onClick={handleAnalyze} width="100%">
                Analyze Sites
              </Button>
            </VStack>
          </Box>

          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Heading size="md" mb={4}>Analysis Results</Heading>
            <Text color="gray.600">
              Select parameters and click Analyze to see results
            </Text>
          </Box>
        </VStack>
      </Grid>
    </Box>
  );
};

export default SiteAnalysis; 