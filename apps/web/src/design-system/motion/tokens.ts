/**
 * Motion tokens (design contract)
 * Implement with Framer Motion during UI build phase.
 */

export const abaMotion = {
  duration: {
    fast: 0.12,
    normal: 0.2,
    slow: 0.32,
  },
  ease: [0.2, 0.8, 0.2, 1] as const,
  sidebar: {
    expanded: 264,
    collapsed: 72,
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 8 },
    },
    drawer: {
      initial: { x: 24, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 24, opacity: 0 },
    },
  },
} as const;
