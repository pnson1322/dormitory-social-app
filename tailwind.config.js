/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        primaryLight: "#3B82F6",
        accent: "#14B8A6",
        background: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
