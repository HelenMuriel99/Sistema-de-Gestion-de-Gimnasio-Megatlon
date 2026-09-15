/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'megatlon-primary': '#E3000F', // Rojo característico de gimnasios
        'megatlon-dark': '#1C1C1C',    // Fondo oscuro
      }
    },
  },
  plugins: [],
}