/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#3B060A",
        "etta-black": "#000000",
        "etta-burgundy": "#3B060A",
        "etta-soft-gray": "#ECEBEO",
        "etta-white": "#FFFFFF",
        "etta-gold": "#FFD700",
      },
    },
  },
  plugins: [],
};
