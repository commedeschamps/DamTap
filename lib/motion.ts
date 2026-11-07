/** Short, interruptible transitions shared by the interface. */
export const motionEase = [0.16, 1, 0.3, 1] as const;
export const layoutTransition = { duration: 0.28, ease: motionEase };
export const pressTransition = { duration: 0.12, ease: motionEase };
export const navigationSpring = { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.8 };
