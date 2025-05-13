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
  useMediaQuery,
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
  // Responsive settings
  const headingSize = useBreakpointValue({ base: "lg", sm: "xl", md: "2xl" });
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  
  return (
    <Box width="100%" overflowX="hidden">
      {/* Hero Section */}
      <Box
        minH="100vh"
        bgGradient="linear(to-br, #0f2347, #1e3c72, #3f5a9e)"
        color="white"
        py={{ base: 6, sm: 8, md: 16 }}
        px={{ base: 3, sm: 4, md: 0 }}
        width="100%"
      >
        <Container 
          maxW={{ base: "100%", md: "90%", lg: "container.lg" }} 
          textAlign="center" 
          pt={{ base: 16, md: 20 }}
          px={{ base: 3, sm: 5, md: 6 }}
        >
          {/* Main Heading */}
          <Heading 
            as="h1" 
            size={headingSize} 
            mb={{ base: 4, md: 6 }} 
            px={{ base: 0, md: 2 }}
            lineHeight="1.2"
            fontWeight="bold"
            maxW={{ base: "100%", md: "90%", lg: "85%" }}
            mx="auto"
          >
            End-to-End EV Charging Station Deployment in One Platform
          </Heading>
          
          {/* Subtitle */}
          <Text 
            fontSize={{ base: "md", sm: "lg", md: "xl" }} 
            mb={{ base: 6, sm: 8, md: 12 }} 
            maxW={{ base: "100%", sm: "90%", md: "800px" }}
            mx="auto"
            px={{ base: 0, md: 2 }}
            lineHeight="1.6"
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
            mb={{ base: 10, sm: 12, md: 16 }}
            shadow="md"
          >
            Start Building
          </Button>
          
          {/* Features Grid */}
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 4 }} 
            spacing={{ base: 8, sm: 10, md: 6, lg: 6 }}
            justifyItems="center"
            mt={{ base: 10, sm: 12, md: 16 }}
            mx="auto"
            maxW="100%"
          >
            {features.map(({ emoji, title, text }) => (
              <VStack 
                key={title} 
                spacing={{ base: 2, md: 3 }} 
                maxW={{ base: "85%", sm: "75%", md: "100%" }}
                p={{ base: 3, md: 4 }}
                borderRadius="lg"
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                  bg: "whiteAlpha.100"
                }}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bg="whiteAlpha.200"
                  w={{ base: "55px", sm: "60px", md: "70px" }}
                  h={{ base: "55px", sm: "60px", md: "70px" }}
                  borderRadius="full"
                  mb={{ base: 1, md: 2 }}
                  boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                >
                  <Text fontSize={{ base: "2xl", md: "3xl" }}>{emoji}</Text>
                </Flex>
                <Heading 
                  fontSize={{ base: "md", sm: "md", md: "lg" }} 
                  fontWeight="semibold"
                  textAlign="center"
                >
                  {title}
                </Heading>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  color="whiteAlpha.900"
                  textAlign="center"
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