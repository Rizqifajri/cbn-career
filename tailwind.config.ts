/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ["var(--font-lora)", "serif"],
        arimo: ["var(--font-arimo)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
