/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // magenta scale built around the Modacare brand colour #b00fa8
      colors: {
        primary: {
          50: '#FDF1FC',
          100: '#FBE0F8',
          200: '#F5C0F1',
          300: '#EA8FE4',
          400: '#DA5AD1',
          500: '#C42DB9',
          600: '#B00FA8', // brand magenta used for the wordmark, primary CTAs, icons
          700: '#8C0C85',
          800: '#6C0A67',
          900: '#4F074A',
        },
        ink: '#2d2d2d', // primary text
        muted: '#737373', // secondary text
        accent: '#FBE0F8',
        // named brand tokens, same colours as the primary scale, kept for the Auth/SafetyNet pages
        brand: '#b00fa8',
        'text-primary': '#2d2d2d',
        'text-secondary': '#737373',
        'input-underline': '#c5c5c5',
        'input-placeholder': '#bebebe',
        divider: '#e5e5e5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '12px',
        pill: '50px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(176, 15, 168, 0.08)',
      },
    },
  },
  plugins: [],
}

