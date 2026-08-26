/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FDFBF7',
          secondary: '#F5F2EB', 
        },
        camel: {
          50: '#F9F6F0',
          100: '#F0E7D8',
          200: '#E4D1B9',
          300: '#D5B694',
          400: '#C79A6D',
          500: '#BA7F48',
          600: '#A4683A',
          700: '#865131',
          800: '#6E432B',
          900: '#5A3825',
        },
        espresso: {
          900: '#2C1E16',
          800: '#3E2A20',
          500: '#8A7366',
        },
        accent: {
          500: '#D97757',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'floating': '0 20px 40px -15px rgba(90, 56, 37, 0.1)',
        'soft': '0 4px 20px -2px rgba(90, 56, 37, 0.05)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

