/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#136F63",
          50: "#E8F8F5",
          100: "#D1F2EB",
          200: "#A3E4D7",
          300: "#76D7C4",
          400: "#48C9B0",
          500: "#136F63",
          600: "#116257",
          700: "#0E5047",
          800: "#0A3C35",
          900: "#072924",
        },
        secondary: {
          DEFAULT: "#FFD166",
          50: "#FFFDF2",
          100: "#FFF8D6",
          200: "#FFF2A8",
          300: "#FFE77A",
          400: "#FFDC4C",
          500: "#FFD166",
          600: "#E6B34B",
          700: "#CC9633",
          800: "#996E1F",
          900: "#66480F",
        },
        success: {
          DEFAULT: "#06D6A0",
          50: "#E6FAF5",
          100: "#CCF5EB",
          500: "#06D6A0",
          700: "#04A37A",
        },
        error: {
          DEFAULT: "#EF476F",
          50: "#FDF0F3",
          100: "#FCE0E6",
          500: "#EF476F",
          700: "#C22D52",
        },
        warning: {
          DEFAULT: "#F4A261",
          50: "#FEF6F0",
          100: "#FDECDA",
          500: "#F4A261",
          700: "#D67A32",
        },
        info: {
          DEFAULT: "#118AB2",
          50: "#E7F3F7",
          100: "#CFE7F0",
          500: "#118AB2",
          700: "#0D6E8E",
        },
        base: {
          light: "#FAF8F3",
          dark: "#0F1109",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#161910",
        },
        borderSubtle: {
          light: "rgba(26, 24, 20, 0.09)",
          dark: "rgba(242, 238, 230, 0.09)",
        },
        text: {
          primary: {
            light: "#1A1814",
            dark: "#F2EEE6",
          },
          secondary: {
            light: "#3D3830",
            dark: "#C9C4B6",
          },
          muted: {
            light: "#6B6560",
            dark: "#8C8779",
          },
        }
      },
      fontFamily: {
        sans: ["System"],
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "28px",
      },
      boxShadow: {
        premium: "0 8px 32px rgba(31, 30, 20, 0.08)",
        glass: "0 8px 32px rgba(31, 30, 20, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
      }
    },
  },
  plugins: [],
};
