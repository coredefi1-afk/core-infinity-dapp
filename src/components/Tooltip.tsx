import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  subtext?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'fuchsia' | 'emerald' | 'blue';
}

export const AnimatedTooltip: React.FC<TooltipProps> = ({
  content,
  subtext,
  position = 'top',
  children,
  className = '',
  glowColor = 'cyan',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const glowStyles = {
    cyan: 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-cyan-300',
    fuchsia: 'border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.4)] text-fuchsia-300',
    emerald: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-emerald-300',
    blue: 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-blue-300',
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
  };

  const animationVariants = {
    initial: {
      opacity: 0,
      scale: 0.92,
      y: position === 'top' ? 6 : position === 'bottom' ? -6 : 0,
      x: position === 'left' ? 6 : position === 'right' ? -6 : 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0,
      x: position === 'left' ? 4 : position === 'right' ? -4 : 0,
      transition: { duration: 0.15 },
    },
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="tooltip"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            className={`absolute z-50 pointer-events-none whitespace-normal min-w-[140px] max-w-[240px] px-3 py-2 rounded-xl bg-slate-950/95 backdrop-blur-xl border ${glowStyles[glowColor]} ${positionClasses[position]}`}
          >
            {/* Tooltip Content Header */}
            <div className="font-orbitron font-bold text-[11px] leading-tight tracking-wide">
              {content}
            </div>

            {/* Optional Subtext Guidance */}
            {subtext && (
              <div className="text-[10px] text-slate-300 font-sans mt-0.5 leading-snug">
                {subtext}
              </div>
            )}

            {/* Subtle Arrow Pointer */}
            <div
              className={`absolute w-2 h-2 bg-slate-950 border border-slate-800 rotate-45 pointer-events-none ${
                position === 'top'
                  ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0'
                  : position === 'bottom'
                  ? 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0'
                  : position === 'left'
                  ? 'right-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0'
                  : 'left-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
