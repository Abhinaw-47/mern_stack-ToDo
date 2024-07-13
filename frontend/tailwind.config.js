/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/components/**/*.js",
    "./src/components/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: "#effef7",
          100: "#dafeef",
          200: "#b8fadd",
          300: "#81f4c3",
          400: "#43e5a0",
          500: "#1acd81",
          600: "#0fa968",
          700: "#108554",
          800: "#126945",
          900: "#11563a",
          950: "#03301f",
        },
        "royal-blue": {
          50: "#eff2ff",
          100: "#dce2fd",
          200: "#c1cdfc",
          300: "#96aefa",
          400: "#6483f6",
          500: "#465ff1",
          600: "#2b3ae5",
          700: "#2228d3",
          800: "#2222ab",
          900: "#212487",
          950: "#191952",
        },
        "blue-marguerite": {
          50: "#ecf0ff",
          100: "#dde2ff",
          200: "#c2caff",
          300: "#9ca6ff",
          400: "#7577ff",
          500: "#6c63ff",
          600: "#5036f5",
          700: "#452ad8",
          800: "#3825ae",
          900: "#312689",
          950: "#1f1650",
        },
      },
    },
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    backgroundPosition: {
      "bottom-md": "center bottom 17px",
      "bottom-sm": "center bottom 8px",
    },
  },
  plugins: [],
}

