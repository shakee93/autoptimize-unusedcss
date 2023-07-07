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
      lineHeight: {
        'db-lh': '0.9344rem',
        'arw-mbox': '1.688rem',
      },

      colors: {
        'gray-350': '#C0C0C0',
        'purple-750': '#7F54B3',
      },

    },
    fontSize: {
      xsss: '0.625rem',
      xss: '0.6875rem',
      xsmm: '0.688rem',
      xsm: '0.75rem',
      xm: '0.8125rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xll: '1.625rem',
    },


  },


  plugins: [],
}
