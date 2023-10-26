/** @type {DefaultColors} */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
let plugin = require('tailwindcss/plugin')
function rem2px(input, fontSize = 16) {
  if (input == null) {
    return input;
  }
  switch (typeof input) {
    case 'object':
      if (Array.isArray(input)) {
        return input.map((val) => rem2px(val, fontSize));
      }
      const ret = {};
      for (const key in input) {
        ret[key] = rem2px(input[key], fontSize);
      }
      return ret;
    case 'string':
      return input.replace(
          /(\d*\.?\d+)rem$/,
          (_, val) => `${parseFloat(val) * fontSize}px`,
      );
    case 'function':
      return eval(input.toString().replace(
          /(\d*\.?\d+)rem/g,
          (_, val) => `${parseFloat(val) * fontSize}px`,
      ));
    default:
      return input;
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // prefix: 'rl-',
  darkMode: ["class", ".rapidload-dark"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    fontFamily: {
      'sans': ['Inter Variable', ...defaultTheme.fontFamily.sans]
    },
    // to fix font-size: 62% problem
    fontSize: rem2px(defaultTheme.fontSize),
    lineHeight: rem2px(defaultTheme.lineHeight),
    spacing: rem2px(defaultTheme.spacing),
    borderRadius: rem2px(defaultTheme.borderRadius),
    minWidth: rem2px(defaultTheme.minWidth),
    width: rem2px(defaultTheme.width),
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      transitionDuration: {
        400 : '400ms'
      },
      fontSize: {
        xxs: ['10px', {
          lineHeight: '1',
        }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          0: '#fff',
          930: '#101012',
          ...colors.zinc
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'gray-350': '#C0C0C0',
        'purple-750': '#7F54B3',
        'zinc-930': '#101012'
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
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
            transform: 'translateX(250%)'
          }
        },
        'bounce-horizontal': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateX(0)'
          },
          '40%': {
            transform: 'translateX(-5px)'  // Reduced horizontal distance for subtleness
          },
          '60%': {
            transform: 'translateX(3px)'   // Reduced horizontal distance for subtleness
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'rl-scale-in': 'rl-scale-in 0.1s ease-out',
        'rl-loading-loop': 'rl-loading-loop 1.8s ease-out infinite',
        'bounce-horizontal': 'bounce-horizontal 1.5s infinite'
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // Add a `third` variant, ie. `third:pb-0`
      addVariant('kids', '&>*')
    }),
      require("tailwindcss-animate")],
}