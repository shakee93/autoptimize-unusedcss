/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#7F54B3',
      'purple-lite': '#F2EEF7',
      'gray-border-line': '#E8E8E8',
      'gray-button-border': '#CBCBCB',
      'gray-lite-background': '#F0F0F0',
      'black-font': '#161616',
      'gray-font': '#6D6D6D',
      'dark-gray-font': '#424242',
      'purple-back-font': '#202020',
    },
    minWidth: {
      'full': '1250px',
    }

  },
  plugins: [],
}
