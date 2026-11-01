/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg-primary)',
          'bg-sec': 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          border: 'var(--border-color)',
          text: 'var(--text-primary)',
          'text-sec': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
          primary: 'var(--primary)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)'
        },
        navy: {
          950: '#030712',
          900: '#080D1B',
          850: '#0E172C',
          800: '#111B2E',
          750: '#192640',
          700: '#1C2541',
          600: '#2A365C'
        },
        electric: {
          blue: '#0066FF',
          glow: '#00D4FF'
        },
        neon: {
          cyan: '#00F5D4',
          purple: '#9D4EDD',
          magenta: '#F72585'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 25px rgba(0, 102, 255, 0.45)',
        'glow-cyan': '0 0 25px rgba(0, 245, 212, 0.45)',
        'glow-purple': '0 0 25px rgba(157, 78, 221, 0.45)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
