import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useBreakpointValue,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const features = [
  {
    emoji: '📍',
    title: 'Site Selection',
    text: 'Find optimal land for EV charging.',
  },
  {
    emoji: '🧾',
    title: 'Permitting & Zoning',
    text: 'Handle local regulations, fast.',
  },
  {
    emoji: '🏗️',
    title: 'Blueprints & Design',
    text: 'Get ready-to-build architectural plans.',
  },
  {
    emoji: '🚧',
    title: 'Construction-Ready',
    text: 'Everything you need before ground-breaking',
  },
];

const HomePage: React.FC = () => {
  // Responsive heading size
  const headingSize = useBreakpointValue({ base: "lg", md: "2xl" });
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        minH="100vh"
        bgGradient="linear(to-br, #0f2347, #1e3c72, #3f5a9e)"
        color="white"
        py={{ base: 8, md: 16 }}
        px={{ base: 4, md: 0 }}
      >
        <Container maxW="container.lg" textAlign="center" pt={{ base: 10, md: 16 }}>
          {/* Main Heading */}
          <Heading 
            as="h1" 
            size={headingSize} 
            mb={{ base: 4, md: 6 }} 
            px={{ base: 2, md: 0 }}
            lineHeight="1.2"
            fontWeight="bold"
          >
            End-to-End EV Charging Station Deployment in One Platform
          </Heading>
          
          {/* Subtitle */}
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            mb={{ base: 8, md: 12 }} 
            maxW="800px" 
            mx="auto"
            px={{ base: 2, md: 0 }}
          >
            From location scouting to permit-ready plans, we help you build faster.
          </Text>
          
          {/* Action Button */}
          <Button
            as={RouterLink}
            to="/properties"
            size={{ base: "md", md: "lg" }}
            bg="white"
            color="gray.800"
            rounded="full"
            px={{ base: 6, md: 8 }}
            py={{ base: 5, md: 6 }}
            _hover={{ bg: "gray.100" }}
            fontWeight="bold"
            mb={{ base: 12, md: 16 }}
          >
            Start Building
          </Button>
          
          {/* Features Grid */}
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 4 }} 
            spacing={{ base: 10, md: 0 }}
            justifyItems="center"
            mt={{ base: 12, md: 20 }}
          >
            {features.map(({ emoji, title, text }) => (
              <VStack key={title} spacing={3} maxW="250px">
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bg="whiteAlpha.200"
                  w={{ base: "60px", md: "70px" }}
                  h={{ base: "60px", md: "70px" }}
                  borderRadius="full"
                  mb={2}
                >
                  <Text fontSize="3xl">{emoji}</Text>
                </Flex>
                <Heading 
                  fontSize={{ base: "md", md: "lg" }} 
                  fontWeight="semibold"
                >
                  {title}
                </Heading>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  color="whiteAlpha.900"
                >
                  {text}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 