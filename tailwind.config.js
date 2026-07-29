/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        knbs: {
          50: '#fdf8f6',
          100: '#fbece6',
          200: '#f6d1c2',
          300: '#eeac93',
          400: '#e17d5c',
          500: '#B06443',
          600: '#98563a',
          700: '#7f4831',
          800: '#663b2a',
          900: '#543225',
          950: '#2d1811',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
