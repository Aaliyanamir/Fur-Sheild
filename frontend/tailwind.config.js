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
          primary: '#F8FAFC',
          secondary: '#F1F5F9',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        accent: {
          500: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
      }
    },
  },
  plugins: [],
}
