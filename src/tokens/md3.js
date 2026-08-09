// Shared Material Design 3 design tokens — imported by both rukn_form and tasko.
// Edit here; both apps pick up the change automatically at build time.

export const md3Colors = {
  // Surface roles
  'surface-dim':               '#cbdbf5',
  'surface-bright':            '#f8f9ff',
  'surface-container-lowest':  '#ffffff',
  'surface-container-low':     '#eff4ff',
  'surface-container':         '#e5eeff',
  'surface-container-high':    '#dce9ff',
  'surface-container-highest': '#d3e4fe',
  'surface-variant':           '#d3e4fe',
  'surface-tint':              '#4d44e3',
  // Outline
  'outline':         '#777587',
  'outline-variant': '#c7c4d8',
  // Background
  'background':    '#f8f9ff',
  'on-background': '#0b1c30',
  // On-surface
  'on-surface':         '#0b1c30',
  'on-surface-variant': '#464555',
  // Primary
  'primary':                  '#4f46e5',
  'primary-container':        '#4f46e5',
  'primary-fixed':             '#e2dfff',
  'primary-fixed-dim':         '#c3c0ff',
  'on-primary':               '#ffffff',
  'on-primary-container':     '#dad7ff',
  'on-primary-fixed':         '#0f0069',
  'on-primary-fixed-variant': '#3323cc',
  'inverse-primary':          '#c3c0ff',
  // Secondary
  'secondary':                  '#565e74',
  'secondary-container':        '#dae2fd',
  'secondary-fixed':            '#dae2fd',
  'secondary-fixed-dim':        '#bec6e0',
  'on-secondary':               '#ffffff',
  'on-secondary-container':     '#5c647a',
  'on-secondary-fixed':         '#131b2e',
  'on-secondary-fixed-variant': '#3f465c',
  // Tertiary
  'tertiary':                  '#46494b',
  'tertiary-container':        '#5e6163',
  'tertiary-fixed':            '#e0e3e5',
  'tertiary-fixed-dim':        '#c4c7c9',
  'on-tertiary':               '#ffffff',
  'on-tertiary-container':     '#dadcde',
  'on-tertiary-fixed':         '#191c1e',
  'on-tertiary-fixed-variant': '#444749',
  // Error
  'error':              '#dc2626',
  'error-container':    '#ffdad6',
  'on-error':           '#ffffff',
  'on-error-container': '#93000a',
  // Inverse
  'inverse-surface':    '#213145',
  'inverse-on-surface': '#eaf1ff',
}

export const md3FontSize = {
  'display-lg':  ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
  'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
  'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
  'body-lg':     ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-md':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'label-md':    ['14px', { lineHeight: '20px', fontWeight: '500' }],
  'label-sm':    ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
}

export const md3FontFamily = {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
}

export const md3Spacing = {
  'gutter':        '1.5rem',
  'sidebar-width': '280px',
}

export const md3BorderRadius = {
  DEFAULT: '0.5rem',
  sm:      '0.25rem',
  md:      '0.75rem',
  lg:      '1rem',
  xl:      '1.5rem',
  full:    '9999px',
}
