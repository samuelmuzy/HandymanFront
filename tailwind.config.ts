import type { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#C85C2D',
          'secondary': '#1E293B',
          'background': '#FFF8F1',
          'input-bg': '#F3B183',
          'button-primary': '#8B2F0A',
          'button-google': '#1E293B',
          'button-facebook': '#1877F2',
          'button-apple': '#000000',
        },
        fontFamily: {
          'sans': ['Inter', 'sans-serif'],
        }
      },
    },
    plugins:[],
} satisfies Config