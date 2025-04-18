import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMapPin, FiList, FiZap, FiTrendingUp } from 'react-icons/fi';

const features = [
  {
    icon: FiMapPin,
    title: 'Available Land',
    text: 'Identify suitable property for EV chargers.',
  },
  {
    icon: FiList,
    title: 'Zoning Information',
    text: 'Check local zonatures and restrictions.',
  },
  {
    icon: FiZap,
    title: 'Grid Capacity',
    text: 'Assess electrical infrastructure availability.',
  },
  {
    icon: FiTrendingUp,
    title: 'Demand Forecast',
    text: 'Predict charging needs based on data.',
  },
];

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero with Feature Overlay */}
      <Box
        minH="100vh"
        bgGradient="linear(to-r, blue.900, purple.700)"
        color="white"
        py={20}
      >
        <Container maxW="container.lg" textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Find sites for EV charging stations in minutes
          </Heading>
          <Text fontSize="xl" mb={6} maxW="600px" mx="auto">
            Get a list of ready-to-build locations so you can quickly start installing chargers.
          </Text>
          <Button
            as={RouterLink}
            to="/properties"
            size="lg"
            bg="white"
            color="gray.800"
            rounded="full"
            px={10}
            _hover={{ bg: 'gray.100' }}
          >
            Get Started
          </Button>
          
          {/* Translucent Features Grid */}
          <Box
            mt={16}
            bg="whiteAlpha.25"
            backdropFilter="blur(12px)"
            p={10}
            borderRadius="xl"
          >
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10}>
              {features.map(({ icon, title, text }) => (
                <Box key={title} textAlign="center">
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="whiteAlpha.300"
                    p={4}
                    borderRadius="full"
                    mb={4}
                  >
                    <Icon as={icon} w={6} h={6} color="white" />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    {title}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800">
                    {text}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 