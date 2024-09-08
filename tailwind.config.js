module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondaryC: "#FF9C01",
        savingsC: "#b304b3",
        expenseC: "#ff6600",
        incomeC: "#2dd4bf",
        whiteC: "#FCFCFC",
        blackC: "#161622",
        grayC: "#242424",
        grayTintC: "#AAAAAA",
        grayOpacity: "#b9b6b686",
      },
      fontFamily: {
        "space-mono": ["SpaceMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
