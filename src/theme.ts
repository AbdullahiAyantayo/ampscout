import { extendTheme } from '@chakra-ui/react'

const breakpoints = {
  sm: '30em',    // 480px
  md: '48em',    // 768px
  lg: '62em',    // 992px
  xl: '80em',    // 1280px
  '2xl': '96em', // 1536px
}

const theme = extendTheme({
  breakpoints,
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: {
          base: '100%',
          sm: '540px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
          '2xl': '1320px',
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        bg: 'gray.50',
        fontSize: {
          base: '16px',
          md: '16px',
          lg: '18px',
        },
        overflowX: 'hidden',
      },
      '@media screen and (max-width: 480px)': {
        html: {
          fontSize: '15px',
        },
      },
    },
  },
})

export default theme 