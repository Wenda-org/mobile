/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Wenda brand colors - Deep green primary
        primary: {
          DEFAULT: '#136F63',
          50: '#E8F5F3',
          100: '#D1EBE7',
          200: '#A3D7CF',
          300: '#75C3B7',
          400: '#47AF9F',
          500: '#136F63',
          600: '#0F5A51',
          700: '#0B453E',
          800: '#08302C',
          900: '#041B19',
        },
        // Secondary yellow accent
        secondary: {
          DEFAULT: '#FFD166',
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFD166',
          500: '#FFC233',
          600: '#FFB300',
          700: '#CC8F00',
          800: '#996B00',
          900: '#664700',
        },
        // Additional Wenda colors
        success: '#06D6A0',
        error: '#EF476F',
        // Background colors
        background: {
          light: '#FFFFFF',
          'light-secondary': '#F0F2F5',
          dark: '#18191A',
          'dark-secondary': '#242526',
          'dark-tertiary': '#3A3B3C',
        },
        // Text colors
        text: {
          light: '#050505',
          'light-secondary': '#65676B',
          dark: '#E4E6EB',
          'dark-secondary': '#B0B3B8',
        },
        // Border colors
        border: {
          light: '#CED0D4',
          'light-subtle': '#E4E6EB',
          dark: '#3E4042',
          'dark-subtle': '#303031',
        },
        // Google brand color
        google: '#4285F4',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      fontFamily: {
        sans: ['System'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
