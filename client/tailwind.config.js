/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        pastel: {
          ...require("daisyui/src/colors/themes")["[data-theme=pastel]"],
          primary: "#A6B1E1",
          secondary: "#FCD8D4",
          accent: "#424874",
          neutral: "#F2F2F2",
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
