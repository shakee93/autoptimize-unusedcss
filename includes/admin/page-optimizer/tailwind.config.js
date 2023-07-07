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
      }
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
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#7F54B3',
      'purple-p': '#867C92',
      'purple-table-header': '#F9F7FA',
      'gray-button': '#EDEDED',
      'purple-tips-text': '#553779',
      'purple-lite': '#F2EEF7',
      'tips-purple': '#E1DDE7',
      'gray-border-line': '#E8E8E8',
      'gray-button-border': '#CBCBCB',
      'gray-lite-background': '#F0F0F0',
      'black-font': '#161616',
      'black': '#000000',
      'black-b': '#2E223D',
      'gray-font': '#6D6D6D',
      'gray-border': '#DFDFDF',
      'gray-highlight': '#D9D9D9',
      'dark-gray-font': '#424242',
      'purple-back-font': '#202020',
      'blue': '#185EF3',
      'gray': '#E8E8E8',
      'gray-p': '#6F6F6F',
      'gray-l': '#B8B8B8',
      'gray-h': '#332247',
      'w-color': '#F0F0F1',
      'message-green': '#48BB78',
      'arrow-message': '#FFF2F2',
      'arrow-message-tc': '#DD3F3F',
      'tips-border-green': '#2ECC71',
      'tips-green-bg': '#DDE6DE',
      'tips-green-head': '#2ECC71',
      'tips-dark-green': '#1F9A53',
      'tips-dark-green-font': '#37793E',
      'performance-green-bg': '#09B42F',
      'red': '#CC0001',
      'green': '#008800',
      'gray-light-font': '#959595',
      'gray-tab': '#909193',
      'gray-toggle': '#B3B3B3',
      'green-refresh': '#62C09B',
      'purple-pro': '#8E68BC',
    },

  },


  plugins: [],
}
