import { motion, useReducedMotion } from 'framer-motion';

// Deterministic lantern configs (SSR-safe, no Math.random at render).
// left: % across the hero; size: px; duration: s for a full rise;
// delay: negative values start mid-flight so the sky is pre-filled;
// sway: horizontal drift amplitude in px; peak: max opacity.
const lanterns = [
  { left: 4, size: 10, duration: 26, delay: -4, sway: 10, peak: 0.5 },
  { left: 10, size: 16, duration: 32, delay: -18, sway: 14, peak: 0.65 },
  { left: 16, size: 8, duration: 22, delay: -9, sway: 8, peak: 0.45 },
  { left: 23, size: 20, duration: 38, delay: -26, sway: 18, peak: 0.7 },
  { left: 29, size: 12, duration: 28, delay: -2, sway: 12, peak: 0.55 },
  { left: 35, size: 9, duration: 24, delay: -14, sway: 9, peak: 0.5 },
  { left: 41, size: 14, duration: 30, delay: -22, sway: 15, peak: 0.6 },
  { left: 48, size: 18, duration: 36, delay: -7, sway: 16, peak: 0.7 },
  { left: 54, size: 10, duration: 25, delay: -17, sway: 10, peak: 0.5 },
  { left: 60, size: 13, duration: 29, delay: -11, sway: 13, peak: 0.6 },
  { left: 66, size: 8, duration: 21, delay: -3, sway: 8, peak: 0.45 },
  { left: 72, size: 22, duration: 40, delay: -30, sway: 20, peak: 0.75 },
  { left: 78, size: 11, duration: 27, delay: -13, sway: 11, peak: 0.55 },
  { left: 84, size: 15, duration: 33, delay: -21, sway: 14, peak: 0.65 },
  { left: 90, size: 9, duration: 23, delay: -6, sway: 9, peak: 0.5 },
  { left: 95, size: 12, duration: 31, delay: -25, sway: 12, peak: 0.6 },
  { left: 20, size: 6, duration: 19, delay: -10, sway: 6, peak: 0.4 },
  { left: 63, size: 6, duration: 20, delay: -15, sway: 6, peak: 0.4 },
];

function Lantern({ left, size, duration, delay, sway, peak }: typeof lanterns[number]) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        bottom: -40,
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 30%, rgba(255, 220, 130, 0.95), rgba(227, 179, 46, 0.55) 55%, rgba(212, 160, 23, 0) 75%)',
        boxShadow: '0 0 18px 6px rgba(227, 179, 46, 0.28), 0 0 42px 14px rgba(200, 16, 46, 0.06)',
        willChange: 'transform, opacity',
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, '-78vh'],
        x: [0, sway, -sway * 0.6, sway * 0.4, 0],
        opacity: [0, peak, peak, 0],
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: 'linear' },
        x: { duration: duration / 2, delay, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration, delay, repeat: Infinity, times: [0, 0.12, 0.82, 1], ease: 'linear' },
      }}
    />
  );
}

export default function LanternBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    // Static, softly glowing accents for reduced-motion users
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {lanterns.slice(0, 8).map((lantern, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${lantern.left}%`,
              top: `${15 + ((i * 31) % 60)}%`,
              width: lantern.size,
              height: lantern.size,
              opacity: lantern.peak * 0.5,
              background: 'radial-gradient(circle at 35% 30%, rgba(255, 220, 130, 0.9), rgba(227, 179, 46, 0.5) 55%, rgba(212, 160, 23, 0) 75%)',
              boxShadow: '0 0 18px 6px rgba(227, 179, 46, 0.25)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {lanterns.map((lantern, i) => (
        <Lantern key={i} {...lantern} />
      ))}
    </div>
  );
}
