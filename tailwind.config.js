/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fog: '#EDF0F4',
        paper: '#FFFFFF',
        ink: '#13203A',
        muted: '#56617A',
        line: '#D5DBE5',
        cobalt: { DEFAULT: '#2547D0', deep: '#1A36A8', tint: '#DCE3FA' },
        marigold: { DEFAULT: '#E9A23B', tint: '#FBEBD0' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '76rem',
      },
    },
  },
  plugins: [],
}
