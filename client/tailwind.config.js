const flowbite = require('flowbite-react/tailwind')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        "dark-mode": 'rgb(16, 23, 42)' 
      },
      fontFamily: {
        'general-sans': ['General Sans', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'sentient': ['Sentient', 'serif'],
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white "
          }
        }
      },
      animation: {
        typing: "typing 3.5s steps(20) infinite alternate, blink .7s infinite"
      }
    },
  },
  plugins: [ flowbite.plugin() ],
}