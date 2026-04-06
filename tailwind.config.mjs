/** @type {import('tailwindcss').Config} */
const config = {
  // Quan trọng: Kích hoạt chế độ dark mode bằng class để kiểm soát trình duyệt Edge [cite: 15, 30]
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#00c853",
      },
    },
  },
  plugins: [],
};

export default config;
