module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb",
          secondary: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
          info: "#0ea5e9",
          success: "#22c55e",
          bg: "#f8fafc",
          text: "#0f172a",
          textMuted: "#475569"
        }
      },
      borderRadius: { xl: "12px" }
    }
  },
  plugins: []
};
