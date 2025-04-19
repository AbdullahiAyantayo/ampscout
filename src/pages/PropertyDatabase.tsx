import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  HStack,
  Badge,
  Button,
  VStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Flex,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface Property {
  id: string;
  address: string;
  type: string;
  size: number;
  zoning: string;
  score: number;
  status: string;
}

const sampleProperties: Property[] = [
  {
    id: '1',
    address: '123 Main St, Detroit',
    type: 'Commercial',
    size: 12000,
    zoning: 'B4',
    score: 85,
    status: 'Available'
  },
  {
    id: '2',
    address: '456 Market St, Detroit',
    type: 'Industrial',
    size: 25000,
    zoning: 'M1',
    score: 92,
    status: 'Under Review'
  },
  {
    id: '3',
    address: '789 Woodward Ave, Detroit',
    type: 'Retail',
    size: 8500,
    zoning: 'B3',
    score: 78,
    status: 'Available'
  },
  {
    id: '4',
    address: '321 Grand River Ave, Detroit',
    type: 'Commercial',
    size: 15000,
    zoning: 'B4',
    score: 88,
    status: 'Under Contract'
  },
  {
    id: '5',
    address: '555 Jefferson Ave, Detroit',
    type: 'Industrial',
    size: 32000,
    zoning: 'M2',
    score: 82,
    status: 'Available'
  },
  {
    id: '6',
    address: '777 Michigan Ave, Detroit',
    type: 'Retail',
    size: 6800,
    zoning: 'B2',
    score: 90,
    status: 'Under Review'
  },
  {
    id: '7',
    address: '246 Gratiot Ave, Detroit',
    type: 'Commercial',
    size: 11500,
    zoning: 'B4',
    score: 86,
    status: 'Available'
  },
  {
    id: '8',
    address: '135 Rosa Parks Blvd, Detroit',
    type: 'Parking',
    size: 18000,
    zoning: 'P1',
    score: 79,
    status: 'Available'
  },
  {
    id: '9',
    address: '842 Cass Ave, Detroit',
    type: 'Retail',
    size: 7200,
    zoning: 'B3',
    score: 84,
    status: 'Under Review'
  },
  {
    id: '10',
    address: '1010 Livernois Ave, Detroit',
    type: 'Industrial',
    size: 42000,
    zoning: 'M1',
    score: 91,
    status: 'Under Contract'
  },
  {
    id: '11',
    address: '428 W Fort St, Detroit',
    type: 'Commercial',
    size: 13500,
    zoning: 'B4',
    score: 87,
    status: 'Available'
  },
  {
    id: '12',
    address: '953 E Warren Ave, Detroit',
    type: 'Retail',
    size: 5800,
    zoning: 'B2',
    score: 81,
    status: 'Under Review'
  },
  {
    id: '13',
    address: '211 W Lafayette Blvd, Detroit',
    type: 'Parking',
    size: 22000,
    zoning: 'P1',
    score: 77,
    status: 'Available'
  },
  {
    id: '14',
    address: '630 Harper Ave, Detroit',
    type: 'Industrial',
    size: 38000,
    zoning: 'M2',
    score: 89,
    status: 'Under Review'
  },
  {
    id: '15',
    address: '1425 Randolph St, Detroit',
    type: 'Commercial',
    size: 9800,
    zoning: 'B3',
    score: 83,
    status: 'Available'
  },
  {
    id: '16',
    address: '368 Bagley Ave, Detroit',
    type: 'Retail',
    size: 6200,
    zoning: 'B2',
    score: 85,
    status: 'Under Contract'
  },
  {
    id: '17',
    address: '512 E Congress St, Detroit',
    type: 'Parking',
    size: 15500,
    zoning: 'P1',
    score: 76,
    status: 'Available'
  },
  {
    id: '18',
    address: '733 St. Antoine St, Detroit',
    type: 'Commercial',
    size: 14200,
    zoning: 'B4',
    score: 88,
    status: 'Under Review'
  },
  {
    id: '19',
    address: '925 Chene St, Detroit',
    type: 'Industrial',
    size: 29500,
    zoning: 'M1',
    score: 80,
    status: 'Available'
  },
  {
    id: '20',
    address: '1200 Trumbull Ave, Detroit',
    type: 'Retail',
    size: 7800,
    zoning: 'B3',
    score: 92,
    status: 'Under Contract'
  }
  // Add more sample properties here
];

const PropertyDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [zoning, setZoning] = useState('');
  const [status, setStatus] = useState('');
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 50000]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([70, 100]);
  const [properties] = useState<Property[]>(sampleProperties);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !propertyType || property.type === propertyType;
    const matchesZoning = !zoning || property.zoning === zoning;
    const matchesStatus = !status || property.status === status;
    const matchesSize = property.size >= sizeRange[0] && property.size <= sizeRange[1];
    const matchesScore = property.score >= scoreRange[0] && property.score <= scoreRange[1];
    return matchesSearch && matchesType && matchesZoning && matchesStatus && matchesSize && matchesScore;
  });

  const uniqueZonings = Array.from(new Set(properties.map(property => property.zoning)));
  const uniqueStatuses = Array.from(new Set(properties.map(property => property.status)));

  // Export filtered properties to CSV
  const handleExport = () => {
    // Define CSV headers
    const headers = ['ID', 'Address', 'Type', 'Size', 'Zoning', 'Score', 'Status'];
    // Map filtered properties to rows
    const rows = filteredProperties.map(({ id, address, type, size, zoning, score, status }) => [
      id,
      address,
      type,
      size.toString(),
      zoning,
      score.toString(),
      status
    ]);
    // Combine headers and rows, wrapping each cell in quotes to handle commas
    const csvContent = [headers, ...rows]
      .map(row => row
        .map(cell => `"${cell.replace(/"/g, '""')}"`)
        .join(','))
        .join('\n');
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'properties.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Heading mb={6}>Property Database</Heading>

      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={6}>
        <VStack spacing={4}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
            <GridItem colSpan={12}>
              <Input
                placeholder="Search by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Type</Text>
              <Select
                placeholder="All Types"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Retail">Retail</option>
                <option value="Parking">Parking Lot</option>
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Zoning</Text>
              <Select
                placeholder="All Zonings"
                value={zoning}
                onChange={(e) => setZoning(e.target.value)}
              >
                {uniqueZonings.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Status</Text>
              <Select
                placeholder="All Statuses"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {uniqueStatuses.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Button colorScheme="brand" mt={6} width="100%" onClick={handleExport}>
                Export CSV
              </Button>
            </GridItem>
            
            <GridItem colSpan={6}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Size Range (sq ft)</Text>
              <Flex>
                <NumberInput 
                  min={0} 
                  max={50000} 
                  value={sizeRange[0]} 
                  onChange={(val) => setSizeRange([parseInt(val), sizeRange[1]])}
                  mr={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <RangeSlider
                  aria-label={['min', 'max']}
                  min={0}
                  max={50000}
                  step={1000}
                  value={sizeRange}
                  onChange={(val) => setSizeRange(val as [number, number])}
                  flex={1}
                  mx={2}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <NumberInput 
                  min={0} 
                  max={50000} 
                  value={sizeRange[1]} 
                  onChange={(val) => setSizeRange([sizeRange[0], parseInt(val)])}
                  ml={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </GridItem>
            
            <GridItem colSpan={6}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Score Range</Text>
              <Flex>
                <NumberInput 
                  min={70} 
                  max={100} 
                  value={scoreRange[0]} 
                  onChange={(val) => setScoreRange([parseInt(val), scoreRange[1]])}
                  mr={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <RangeSlider
                  aria-label={['min', 'max']}
                  min={70}
                  max={100}
                  step={1}
                  value={scoreRange}
                  onChange={(val) => setScoreRange(val as [number, number])}
                  flex={1}
                  mx={2}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <NumberInput 
                  min={70} 
                  max={100} 
                  value={scoreRange[1]} 
                  onChange={(val) => setScoreRange([scoreRange[0], parseInt(val)])}
                  ml={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </GridItem>
          </Grid>
        </VStack>
      </Box>

      <Box bg="white" borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Type</Th>
              <Th isNumeric>Size (sq ft)</Th>
              <Th>Zoning</Th>
              <Th isNumeric>Score</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProperties.map((property) => (
              <Tr key={property.id}>
                <Td>{property.address}</Td>
                <Td>{property.type}</Td>
                <Td isNumeric>{property.size.toLocaleString()}</Td>
                <Td>{property.zoning}</Td>
                <Td isNumeric>
                  <Badge colorScheme={property.score >= 80 ? 'green' : 'yellow'}>
                    {property.score}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      property.status === 'Available'
                        ? 'green'
                        : property.status === 'Under Review'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {property.status}
                  </Badge>
                </Td>
                <Td>
                  <Button size="sm" colorScheme="brand" variant="ghost">
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default PropertyDatabase; 