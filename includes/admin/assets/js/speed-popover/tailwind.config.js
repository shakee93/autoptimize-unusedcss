/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "src/**/*.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
    }
  },
  plugins: [],
  // prefix: 'rlsp-',
  options: {
    safelist: ['rl-node-wrapper'],
  },
  corePlugins: {
    // preflight: false
  }
}

