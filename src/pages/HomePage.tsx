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
  useBreakpointValue,
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
  // Responsive heading size
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  
  return (
    <Box>
      {/* Hero with Feature Overlay */}
      <Box
        minH={{ base: "calc(100vh - 80px)", md: "100vh" }}
        bgGradient="linear(to-r, blue.900, purple.700)"
        color="white"
        py={{ base: 12, md: 20 }}
        px={{ base: 4, md: 0 }}
      >
        <Container maxW="container.lg" textAlign="center" pt={{ base: 10, md: 16 }}>
          <Heading as="h1" size={headingSize} mb={{ base: 3, md: 4 }} px={{ base: 2, md: 0 }}>
            Find sites for EV charging stations in minutes
          </Heading>
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            mb={{ base: 5, md: 6 }} 
            maxW="600px" 
            mx="auto"
            px={{ base: 2, md: 0 }}
          >
            Get a list of ready-to-build locations so you can quickly start installing chargers.
          </Text>
          <Button
            as={RouterLink}
            to="/properties"
            size={{ base: "md", md: "lg" }}
            bg="white"
            color="gray.800"
            rounded="full"
            px={{ base: 6, md: 10 }}
            py={{ base: 5, md: 6 }}
            _hover={{ bg: "gray.100" }}
            fontWeight="bold"
          >
            Get Started
          </Button>
          
          {/* Translucent Features Grid */}
          <Box
            mt={{ base: 12, md: 16 }}
            bg="whiteAlpha.25"
            backdropFilter="blur(12px)"
            p={{ base: 6, md: 10 }}
            borderRadius="xl"
            mx={{ base: -2, md: 0 }}
          >
            <SimpleGrid 
              columns={{ base: 1, sm: 2, md: 4 }} 
              spacing={{ base: 8, md: 10 }}
              justifyItems="center"
            >
              {features.map(({ icon, title, text }) => (
                <Box key={title} textAlign="center" maxW="200px">
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
                  <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={2}>
                    {title}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="whiteAlpha.800">
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