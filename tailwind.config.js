/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gaming: ['"Press Start 2P"', 'cursive']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.purple.400'),
              '&:hover': {
                color: theme('colors.purple.300'),
              },
            },
            h2: {
              color: theme('colors.white'),
              marginTop: '2em',
              marginBottom: '0.5em',
            },
            h3: {
              color: theme('colors.white'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            h4: {
              color: theme('colors.white'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.purple.600'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.purple.300'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              code: {
                backgroundColor: 'transparent',
              },
            },
            strong: {
              color: theme('colors.white'),
            }
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.purple.400'),
              '&:hover': {
                color: theme('colors.purple.300'),
              },
            },
          },
        },
      }),
    }
  },
  plugins: [typography, forms]
};