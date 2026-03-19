/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["InstrumentSerif_400Regular"],
        body: ["SpaceGrotesk_400Regular"],
        medium: ["SpaceGrotesk_500Medium"],
        bold: ["SpaceGrotesk_700Bold"],
      },
    },
  },
  plugins: [],
};
