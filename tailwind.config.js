/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DBCAAF",
        btn: "#C5AF8C",
        btn_hover: "#9A7F56",
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
