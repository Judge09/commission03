/**
 * Custom Chakra UI Theme
 * Includes custom font definitions and design system
 */

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  // Color palette
  colors: {
    brand: {
      50: '#fff5e6',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    },
    orange: {
      50: '#fff5f0',
      100: '#ffe4d6',
      200: '#ffc9a8',
      300: '#ffab7a',
      400: '#ff8c4c',
      500: '#FF7F50', // Coral
      600: '#ff6933',
      700: '#ff5219',
      800: '#ff3b00',
      900: '#e63500',
    },
  },

  // Global font settings
  fonts: {
    heading: "'Playfair Display', serif", // Recoleta alternative
    body: "'Poppins', sans-serif",

    // Custom fonts for specific use cases
    recoleta: "'Playfair Display', serif",
    allrounder: "'Montserrat', sans-serif",
    lora: "'Lora', serif",
    faithful: "'Dancing Script', cursive",
    theSeasons: "'Cinzel', serif",
    sachez: "'Raleway', sans-serif",
  },

  // Component-specific styles
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 500,
        borderRadius: 'lg',
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: 600,
        fontSize: '0.75rem',
      },
    },
  },

  // Global styles
  styles: {
    global: {
      'html, body': {
        fontFamily: "'Poppins', sans-serif",
        color: 'gray.800',
        backgroundColor: '#fffaf5',
      },
      // Ensure custom font variables are available
      ':root': {
        '--font-recoleta': "'Playfair Display', serif",
        '--font-allrounder': "'Montserrat', sans-serif",
        '--font-lora': "'Lora', serif",
        '--font-faithful': "'Dancing Script', cursive",
        '--font-the-seasons': "'Cinzel', serif",
        '--font-sachez': "'Raleway', sans-serif",
      },
    },
  },
});

export default theme;
