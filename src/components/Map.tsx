import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { Box, Text, Badge, Flex, Alert, AlertIcon } from '@chakra-ui/react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Interface for site data
interface Site {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  score: number;
  status: 'available' | 'under-review' | 'selected';
}

// Main Map component
const MapComponent: React.FC = () => {
  // State for selected site popup
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Get Mapbox token from environment variables
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Sample sites across Detroit
  const sites: Site[] = [
    {
      id: '1',
      latitude: 42.3314,
      longitude: -83.0458,
      name: 'Downtown Detroit Location',
      score: 85,
      status: 'available'
    },
    {
      id: '2',
      latitude: 42.3401,
      longitude: -83.0550,
      name: 'Michigan Avenue Site',
      score: 92,
      status: 'under-review'
    },
    {
      id: '3',
      latitude: 42.3489,
      longitude: -83.0401,
      name: 'Gratiot Avenue Location',
      score: 78,
      status: 'available'
    },
    {
      id: '4',
      latitude: 42.3337,
      longitude: -83.0552,
      name: 'Grand River Site',
      score: 88,
      status: 'selected'
    },
    {
      id: '5',
      latitude: 42.3412,
      longitude: -83.0623,
      name: 'Warren Avenue Location',
      score: 82,
      status: 'available'
    },
    {
      id: '6',
      latitude: 42.3478,
      longitude: -83.0345,
      name: 'Jefferson Avenue Site',
      score: 90,
      status: 'under-review'
    },
    {
      id: '7',
      latitude: 42.3561,
      longitude: -83.0632,
      name: 'New Center Location',
      score: 86,
      status: 'available'
    },
    {
      id: '8',
      latitude: 42.3273,
      longitude: -83.0350,
      name: 'Riverfront Site',
      score: 94,
      status: 'selected'
    },
    {
      id: '9',
      latitude: 42.3398,
      longitude: -83.0200,
      name: 'Eastern Market Area',
      score: 89,
      status: 'under-review'
    },
    {
      id: '10',
      latitude: 42.3692,
      longitude: -83.0724,
      name: 'Milwaukee Junction',
      score: 79,
      status: 'available'
    },
    {
      id: '11',
      latitude: 42.3237,
      longitude: -83.0652,
      name: 'Corktown District',
      score: 91,
      status: 'under-review'
    },
    {
      id: '12',
      latitude: 42.3585,
      longitude: -83.0485,
      name: 'Midtown Detroit',
      score: 87,
      status: 'selected'
    },
    {
      id: '13',
      latitude: 42.3310,
      longitude: -83.0812,
      name: 'Southwest Detroit',
      score: 81,
      status: 'available'
    },
    {
      id: '14',
      latitude: 42.3775,
      longitude: -83.0412,
      name: 'Hamtramck Border',
      score: 83,
      status: 'under-review'
    },
    {
      id: '15',
      latitude: 42.3453,
      longitude: -83.0209,
      name: 'Lafayette Park',
      score: 93,
      status: 'available'
    }
  ];

  // Get status color based on site status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'green.500';
      case 'under-review':
        return 'yellow.500';
      case 'selected':
        return 'blue.500';
      default:
        return 'gray.500';
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <Alert status="error">
        <AlertIcon />
        Mapbox token is missing. Please check your .env file.
      </Alert>
    );
  }

  return (
    <Box 
      width="100%" 
      height="600px" 
      position="relative" 
      border="1px solid #ddd"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Using a known working mapbox style with just the essential properties */}
      <Map
        initialViewState={{
          latitude: 42.3314,
          longitude: -83.0458,
          zoom: 11.5
        }}
        mapboxAccessToken="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: '100%', height: '100%' }}
        onError={(e) => {
          console.error('Map error:', e.error);
          setMapError(`Error loading map: ${e.error?.message || 'Unknown error'}`);
        }}
      >
        <NavigationControl position="top-right" />
        
        {/* Render all site markers */}
        {sites.map(site => (
          <Marker
            key={site.id}
            latitude={site.latitude}
            longitude={site.longitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedSite(site);
            }}
          >
            <Box
              bg={getStatusColor(site.status)}
              w={8}
              h={8}
              borderRadius="full"
              cursor="pointer"
              _hover={{ transform: 'scale(1.1)' }}
              transition="transform 0.2s"
              border="3px solid white"
              boxShadow="0 3px 6px rgba(0,0,0,0.3)"
            />
          </Marker>
        ))}

        {/* Popup for selected site */}
        {selectedSite && (
          <Popup
            latitude={selectedSite.latitude}
            longitude={selectedSite.longitude}
            onClose={() => setSelectedSite(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            offset={20}
          >
            <Box p={2} minW="200px">
              <Text fontWeight="bold" mb={2}>{selectedSite.name}</Text>
              <Flex direction="column" gap={1}>
                <Badge colorScheme={selectedSite.score >= 80 ? 'green' : 'yellow'}>
                  Score: {selectedSite.score}
                </Badge>
                <Badge colorScheme={selectedSite.status === 'available' ? 'green' : selectedSite.status === 'under-review' ? 'yellow' : 'blue'}>
                  Status: {selectedSite.status.replace('-', ' ')}
                </Badge>
              </Flex>
            </Box>
          </Popup>
        )}
      </Map>

      {/* Error message */}
      {mapError && (
        <Alert status="error" position="absolute" bottom="0" left="0" right="0">
          <AlertIcon />
          {mapError}
        </Alert>
      )}

      {/* Map legend */}
      <Box
        position="absolute"
        bottom={4}
        left={4}
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="sm"
        zIndex={1}
      >
        <Flex gap={2} align="center">
          <Flex align="center" gap={1}>
            <Box w={3} h={3} borderRadius="full" bg="green.500" />
            <Text fontSize="sm">Available</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
            <Text fontSize="sm">Under Review</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Box w={3} h={3} borderRadius="full" bg="blue.500" />
            <Text fontSize="sm">Selected</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default MapComponent; 