import type { Transition } from "motion/react";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.8,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

export const fadeQuick: Transition = { duration: 0.16, ease: "easeOut" };

export const springFirm: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 38,
};

export const springGlide: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 26,
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: springSoft },
};
