import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'text': {
          DEFAULT: '#060114',
          50: '#f4f3f7',
          100: '#e9e7ef',
          200: '#d3cfdf',
          300: '#bdb7cf',
          400: '#a79fbf',
          500: '#9187af',
          600: '#7b6f9f',
          700: '#65578f',
          800: '#4f3f7f',
          900: '#392f6f',
          950: '#060114'
        },
        'background': {
          DEFAULT: '#f8f6fe',
          50: '#f8f6fe',
          100: '#f1edfd',
          200: '#e3dbfb',
          300: '#d5c9f9',
          400: '#c7b7f7',
          500: '#b9a5f5',
          600: '#ab93f3',
          700: '#9d81f1',
          800: '#8f6fef',
          900: '#815ded'
        },
        'primary': {
          DEFAULT: '#4e1ff2',
          50: '#f5f2ff',
          100: '#ebe5ff',
          200: '#d7cbff',
          300: '#c3b1ff',
          400: '#af97ff',
          500: '#9b7dff',
          600: '#8763ff',
          700: '#7349ff',
          800: '#5f2fff',
          900: '#4e1ff2',
          950: '#3a1bb3'
        },
        'secondary': {
          DEFAULT: '#f882f3',
          50: '#fef5fe',
          100: '#fdebfd',
          200: '#fbd7fb',
          300: '#f9c3f9',
          400: '#f7aff7',
          500: '#f59bf5',
          600: '#f387f3',
          700: '#f173f1',
          800: '#ef5fef',
          900: '#f055eb',
          950: '#c242c1'
        },
        'accent': {
          DEFAULT: '#f442ad',
          50: '#fef2f9',
          100: '#fde5f3',
          200: '#fbcbe7',
          300: '#f9b1db',
          400: '#f797cf',
          500: '#f57dc3',
          600: '#f363b7',
          700: '#f149ab',
          800: '#ef2f9f',
          900: '#ed1593',
          950: '#c21279'
        }
      }
    },
  },
  plugins: []
}

export default config