/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'atom-dark': '#1a2233',
        'atom-blue': '#378ADD',
        'atom-light': '#f8f9fa',
      },
    },
  },
  plugins: [],
}
