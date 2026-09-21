/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { rounded: ["'M PLUS Rounded 1c'", 'sans-serif'] },
      colors: { ink: '#1e1b4b', line: '#c7d2fe' },
    },
  },
  plugins: [],
};
