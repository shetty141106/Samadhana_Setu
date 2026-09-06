/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jh-green': {
          50: '#f0f8f4',
          100: '#d7eee2',
          200: '#b2dfc8',
          300: '#83caa9',
          400: '#52af86',
          500: '#2e935e',
          600: '#23774b',
          700: '#1B5E3B', // Lush Forest
          800: '#134e3a',
          900: '#0B3D2E', // Deep Sal Forest Primary
          950: '#051f17',
        },
        'jh-terracotta': {
          50: '#fdf4ee',
          100: '#fae3d5',
          200: '#f4c4a8',
          300: '#eca076',
          400: '#f38744',
          500: '#E07A3D', // Saffron Accent
          600: '#db6a30',
          700: '#C45C26', // Terracotta Red Soil
          800: '#9d3f17',
          900: '#7e3415',
        },
        'jh-earth': {
          50: '#FDFBF7',
          100: '#F8F5EE', // Warm Cream
          200: '#E8DFD0', // Sand Accent
          300: '#D5C7B3',
          400: '#B4A28A',
          500: '#8E7C65',
          600: '#6E5F4D',
          700: '#534739',
          800: '#3D342B',
          900: '#28221C',
        },
        'jh-gold': {
          400: '#F2C94C',
          500: '#D4AF37',
          600: '#B89324',
        },
        'jh-charcoal': '#1C2826',
        'jh-indigo': '#2D4059',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Merriweather', 'serif'],
        heading: ['Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'jh-soft': '0 4px 20px -2px rgba(11, 61, 46, 0.08), 0 2px 6px -1px rgba(11, 61, 46, 0.04)',
        'jh-card': '0 10px 30px -4px rgba(11, 61, 46, 0.1), 0 4px 10px -2px rgba(11, 61, 46, 0.05)',
        'jh-glow': '0 0 25px rgba(27, 94, 59, 0.25)',
      },
      backgroundImage: {
        'forest-overlay': 'linear-gradient(180deg, rgba(11, 61, 46, 0.82) 0%, rgba(11, 61, 46, 0.65) 60%, rgba(11, 61, 46, 0.92) 100%)',
        'forest-overlay-light': 'linear-gradient(180deg, rgba(11, 61, 46, 0.7) 0%, rgba(11, 61, 46, 0.45) 50%, rgba(11, 61, 46, 0.85) 100%)',
        'terracotta-gradient': 'linear-gradient(135deg, #C45C26 0%, #E07A3D 100%)',
        'green-gradient': 'linear-gradient(135deg, #0B3D2E 0%, #1B5E3B 100%)',
      }
    },
  },
  plugins: [],
}
