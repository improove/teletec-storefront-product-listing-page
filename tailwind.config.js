/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        body: 'var(--color-body)',
        surface: 'var(--color-surface)',
        'on-primary': 'var(--color-on-primary)',
        'on-secondary': 'var(--color--on-secondary)',
        'on-body': 'var(--color-on-body)',
        'on-surface': 'var(--color-on-surface)',
        gray: {
          100: 'var(--color-gray-1)',
          200: 'var(--color-gray-2)',
          300: 'var(--color-gray-3)',
          400: 'var(--color-gray-4)',
          500: 'var(--color-gray-5)',
          600: 'var(--color-gray-6)',
          700: 'var(--color-gray-7)',
          800: 'var(--color-gray-8)',
          900: 'var(--color-gray-9)',
        },
        red: {
          teletec: 'var(--color-red-teletec)',
        }
      },
      spacing: {
        xss: 'var(--spacing-xxs)',
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontFamily: {
        'font-body': 'var(--font-body)',
      },
      fontWeight: {
        thin: 'var(--font-thin)',
        extralight: 'var(--font-extralight)',
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        extrabold: 'var(--font-extrabold)',
        black: 'var(--font-black)',
      },
      fontSize: {
        xs: ['var(--font-xs)', { lineHeight: 'var(--leading-none)' }],
        sm: ['var(--font-sm)', { lineHeight: 'var(--leading-tight)' }],
        base: ['var(--font-md)', { lineHeight: 'var(--leading-snug)' }],
        lg: ['var(--font-lg)', { lineHeight: 'var(--leading-normal)' }],
        xl: ['var(--font-xl)', { lineHeight: 'var(--leading-relaxed)' }],
        '2xl': ['var(--font-2xl)', { lineHeight: 'var(--leading-loose)' }],
        '3xl': ['var(--font-3xl)', { lineHeight: '2.25rem' }],
        '4xl': ['var(--font-4xl)', { lineHeight: '2.5rem' }],
        '5xl': ['var(--font-5xl)', { lineHeight: '1' }],
      },
      lineHeight: {
        none: 'var(--leading-none)',
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal',
        relaxed: 'var(--leading-relaxed)',
        loose: 'var(--leading-loose)',
        3: 'var(--leading-3)',
        4: 'var(--leading-4)',
        5: 'var(--leading-5)',
        6: 'var(--leading-6)',
        7: 'var(--leading-7)',
        8: 'var(--leading-8)',
        9: 'var(--leading-9)',
        10: 'var(--leading-10)',
      },
    },

    plugins: [],
  },
};
