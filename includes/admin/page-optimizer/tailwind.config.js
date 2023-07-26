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
    },
  },
  plugins: [],
}
