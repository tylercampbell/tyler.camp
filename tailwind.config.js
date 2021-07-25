module.exports = {
  mode: 'jit',
  purge: [
    './**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        keyframes: {
            wiggle: {
                '0%, 100%': {
                    transform: 'rotate(-3deg)'
                },
                '50%': {
                    transform: 'rotate(3deg)'
                },
            }
        },
        animation: {
            wiggle: 'wiggle 3s ease-in-out infinite',
        }
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus'],
    },
  },
  plugins: [],
}