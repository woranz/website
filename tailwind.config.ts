import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noe': ['Noe Display', 'Georgia', 'serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'woranz': {
          'dark': '#1A1A2E',
          'gray': '#2E3547',
          'yellow': '#FFE016',
          'cream': '#FBF9F6',
          'border': '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
}
export default config
