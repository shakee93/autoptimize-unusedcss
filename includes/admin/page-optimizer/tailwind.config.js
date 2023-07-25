/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        Lexend: ["Lexend", "sans-serif"],
      },
      colors: {
        'gray-350': '#C0C0C0',
        'purple-750': '#7F54B3',
      },
      animation: {
        'rl-scale-in': 'rl-scale-in 0.1s ease-out',
        'rl-loading-loop': 'rl-loading-loop 1.5s ease-out infinite',
      },
      keyframes: {
        'rl-scale-in' : {
          'from': {
            opacity: 0,
            transform: 'translateY(-5px)',
          },
          'to': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'rl-loading-loop' : {
          '0%, 100%' : {
            transform: 'translateX(-50%)'
          },
          '50%': {
            transform: 'translateX(400%)'
          }
        }
      }
    },
  },
  plugins: [],
}
