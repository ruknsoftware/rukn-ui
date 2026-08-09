import {
  md3Colors,
  md3FontSize,
  md3FontFamily,
  md3Spacing,
  md3BorderRadius,
} from "./src/tokens/md3.js";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: md3Colors,
      fontSize: md3FontSize,
      fontFamily: md3FontFamily,
      spacing: md3Spacing,
      borderRadius: md3BorderRadius,
    },
  },
};
