/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Superficies: slate con tinte azul, de más profunda a más elevada.
        base: '#0B0F17',
        surface: '#121826',
        raised: '#1A2234',
        line: '#232E42',
        // Texto: los tres niveles pasan 4.5:1 sobre base y surface.
        ink: '#F1F5F9',
        muted: '#A3B1C6',
        faint: '#8795AB',
        brand: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, 8px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fade-up 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
