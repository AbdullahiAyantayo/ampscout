import React from 'react';
import { Box, Flex, Link, Button, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  // Detect current route for conditional styling
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <Box
      as="nav"
      position={isHome ? 'absolute' : 'static'}
      top={0}
      w="100%"
      bg={isHome ? 'transparent' : 'white'}
      boxShadow={isHome ? 'none' : 'sm'}
      px={4}
      py={2}
      zIndex="overlay"
    >
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Heading as={RouterLink} to="/" size="lg" color={isHome ? 'white' : 'brand.600'}>
          AmpScout
        </Heading>
        
        <Flex gap={4} align="center">
          {isHome ? (
            <>
              <Link as={RouterLink} to="/properties">
                <Button variant="solid" colorScheme="whiteAlpha" rounded="md">
                  Property Database
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/properties">
                <Button variant="ghost" colorScheme="brand">Property Database</Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 