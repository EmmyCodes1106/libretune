/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          canvas: 'var(--color-canvas)',
          surface: 'var(--color-surface)',
          raised: 'var(--color-raised)',
          border: 'var(--color-border)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          accent: '#A78BFA',     // Electric violet / lavender (#A78BFA)
          action: '#7750E8',     // Vibrant action purple (#7750E8)
          'action-hover': '#653ee0',
          'action-active': '#5530cf',
        },
        dark: {
          canvas: '#101014',
          surface: '#19191F',
          raised: '#23232C',
          border: '#35353F',
          primary: '#F6F5FA',
          secondary: '#B1AFBF',
        },
        light: {
          canvas: '#F7F6FA',
          surface: '#FFFFFF',
          raised: '#F0EFF5',
          border: '#E3E1EB',
          primary: '#191720',
          secondary: '#656170',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['52px', { lineHeight: '1.07', fontWeight: '700' }],
        'page-title': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
        'mobile-title': ['32px', { lineHeight: '1.15', fontWeight: '700' }],
        'section': ['22px', { lineHeight: '1.25', fontWeight: '700' }],
        'body': ['14px', { lineHeight: '1.45', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.45', fontWeight: '400' }],
      },
      borderRadius: {
        'card': '16px',
        'control': '12px',
        'chip': '100px',
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(0, 0, 0, 0.14)',
      },
      width: {
        'sidebar': '224px',
      },
      spacing: {
        'sidebar': '224px',
        'inset-desktop': '40px',
        'inset-mobile': '20px',
      }
    },
  },
  plugins: [],
}
