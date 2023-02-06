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
      'gray-support': '#DCDCDC',
      'gray-lite-background': '#F0F0F0',
      'black-font': '#161616',
      'gray-font': '#6D6D6D',
      'dark-gray-font': '#424242',
      'purple-back-font': '#202020',
      'blue': '#185EF3',
      'gray': '#E8E8E8',
      'w-color': '#F0F0F1',
      'message-green': '#48BB78',
      'light-red': '#FFE7E7',
      'red-font': '#D71A1A',
      'light-green': '#E7FFEC',
      'dark-green': '#1AB032',
      'orange-progress-bar': '#FFE8E8',
      'green-progress-bar': '#1AB032',
      'red-progress-bar': '#EB483F',
    },


  },
  plugins: [
  ],
}
