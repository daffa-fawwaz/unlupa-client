export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED", 
        primarySoft: "#EDE9FE", 
        accent: "#FBBF24", 
        surface: "#FFFFFF",
        muted: "#F3F4F6",
        textMain: "#111827",
      },
      zIndex: {
        "9999": "9999",
      },
    },
  },
  plugins: [],
};
