/**
 * Shared Modal Animation Configurations
 * Consistent animations across all supervision modals
 */

/**
 * Overlay animation (fade in/out)
 */
export const OVERLAY_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

/**
 * Slide panel animation (from right)
 */
export const SLIDE_PANEL_ANIMATION = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { type: 'spring', damping: 25, stiffness: 200 }
};

/**
 * Scale animation (for centered modals)
 */
export const SCALE_ANIMATION = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.2 }
};

/**
 * Slide in from left animation (for list items)
 */
export const SLIDE_IN_LEFT_ANIMATION = (delay = 0) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay }
});

/**
 * Icon bounce animation (for notification icons)
 */
export const ICON_BOUNCE_ANIMATION = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { delay: 0.1, type: 'spring', stiffness: 200 }
};

/**
 * Staggered children animation (for lists)
 */
export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

