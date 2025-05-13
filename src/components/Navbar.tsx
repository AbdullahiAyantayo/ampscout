import React from 'react';
import { 
  Box, 
  Flex, 
  Link, 
  Button, 
  Heading,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const Navbar: React.FC = () => {
  // Detect current route for conditional styling
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="nav"
      position={isHome ? 'absolute' : 'static'}
      top={0}
      w="100%"
      bg={isHome ? 'transparent' : 'white'}
      boxShadow={isHome ? 'none' : 'sm'}
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 3 }}
      zIndex="overlay"
    >
      <Flex 
        maxW="1200px" 
        mx="auto" 
        align="center" 
        justify="space-between"
        wrap="wrap"
      >
        <Heading 
          as={RouterLink} 
          to="/" 
          size={{ base: "md", md: "lg" }}
          color={isHome ? 'white' : 'brand.600'}
          fontWeight="bold"
          letterSpacing="tight"
        >
          AmpScout
        </Heading>
        
        {isMobile ? (
          <>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
              colorScheme={isHome ? "whiteAlpha" : "brand"}
              aria-label="Open menu"
              fontSize="20px"
              icon={<FiMenu />}
            />
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              size="xs"
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align="stretch" mt={4}>
                    <Link 
                      as={RouterLink} 
                      to="/properties" 
                      onClick={onClose}
                      fontWeight="medium"
                    >
                      Property Database
                    </Link>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Flex gap={4} align="center" display={{ base: 'none', md: 'flex' }}>
            {isHome ? (
              <>
                <Link as={RouterLink} to="/properties">
                  <Button 
                    variant="solid" 
                    colorScheme="whiteAlpha" 
                    rounded="md"
                    size={{ base: "sm", lg: "md" }}
                  >
                    Property Database
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link as={RouterLink} to="/properties">
                  <Button 
                    variant="ghost" 
                    colorScheme="brand"
                    size={{ base: "sm", lg: "md" }}
                  >
                    Property Database
                  </Button>
                </Link>
              </>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 