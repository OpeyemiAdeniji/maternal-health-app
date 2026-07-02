/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // purple scale pulled directly from the Figma "Modacare" file's fills
      colors: {
        primary: {
          50: '#F5F3FF', // page background — soft lavender white
          100: '#E8E3FF', // accent
          200: '#D9D1FF',
          300: '#BFAFFF',
          400: '#9B85FF',
          500: '#8267FF',
          600: '#6B4EFF', // brand purple used for the wordmark, primary CTAs, icons
          700: '#5636E0',
          800: '#4527B3',
          900: '#341D80',
        },
        ink: '#1A1A2E', // primary text
        muted: '#6B7280', // secondary text
        accent: '#E8E3FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '50px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(107, 78, 255, 0.08)',
      },
    },
  },
  plugins: [],
}

