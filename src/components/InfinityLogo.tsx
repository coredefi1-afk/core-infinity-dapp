import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface InfinityLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  animate?: boolean;
  interactive?: boolean;
  continuous3DRotation?: boolean;
  className?: string;
  variant?: 'full' | 'horizontal' | 'compact';
}

/**
 * 3D Laser Ribbon Infinity Loop Graphic with Framer Motion Continuous 3D Rotation & Interactive Tilt
 */
export const Infinity3DIcon: React.FC<{
  size?: number;
  animate?: boolean;
  interactive?: boolean;
  continuous3DRotation?: boolean;
  className?: string;
}> = ({
  size = 64,
  animate = true,
  interactive = true,
  continuous3DRotation = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Motion values for interactive tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig);
  const translateZ = useSpring(isHovered ? 30 : 0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Infinity Loop SVG Path Data (Exact geometric lemniscate ribbon)
  const pathD =
    'M 68,65 C 24,18 4,110 68,110 C 120,110 120,20 172,20 C 236,20 216,110 172,65 C 120,20 120,110 68,65 Z';
  const innerTrackD =
    'M 68,65 C 32,26 14,102 68,102 C 116,102 116,28 172,28 C 226,28 208,102 172,65 C 116,28 116,102 68,65 Z';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center shrink-0 select-none cursor-pointer perspective-[1200px] ${className}`}
      style={{
        width: size,
        height: size * 0.62,
        perspective: 1200,
      }}
    >
      <motion.div
        animate={
          continuous3DRotation
            ? {
                rotateY: [0, 360],
                rotateX: [12, -12, 12],
                rotateZ: [-3, 3, -3],
                y: [-6, 6, -6],
              }
            : undefined
        }
        transition={
          continuous3DRotation
            ? {
                rotateY: { repeat: Infinity, ease: 'linear', duration: 12 },
                rotateX: { repeat: Infinity, ease: 'easeInOut', duration: 6 },
                rotateZ: { repeat: Infinity, ease: 'easeInOut', duration: 4 },
                y: { repeat: Infinity, ease: 'easeInOut', duration: 3 },
              }
            : undefined
        }
        style={{
          rotateX: !continuous3DRotation && interactive ? rotateX : undefined,
          rotateY: !continuous3DRotation && interactive ? rotateY : undefined,
          z: translateZ,
          transformStyle: 'preserve-3d',
        }}
        className={`w-full h-full relative flex items-center justify-center ${
          animate && !continuous3DRotation && !isHovered ? 'animate-figure8' : ''
        }`}
      >
        {/* Dynamic Volumetric Ambient Glow Behind the 3D Loop */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl opacity-75 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100 scale-125' : ''
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 25% 50%, rgba(34, 197, 94, 0.5) 0%, transparent 65%), radial-gradient(ellipse at 75% 50%, rgba(37, 99, 235, 0.6) 0%, transparent 65%)',
          }}
        />

        {/* Central Luminous Orbiting Cyber Ring with 3D Gimbal Rotation */}
        <motion.div
          animate={
            continuous3DRotation
              ? { rotateZ: [0, 360], rotateX: [65, 65] }
              : { rotate: 360 }
          }
          transition={{ repeat: Infinity, ease: 'linear', duration: 8 }}
          className="absolute w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/40 blur-[0.5px] pointer-events-none opacity-60"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 14 }}
          className="absolute w-32 h-32 rounded-full border border-fuchsia-500/25 pointer-events-none opacity-40"
        />

        <svg
          viewBox="0 0 240 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_22px_rgba(6,182,212,0.7)] overflow-visible"
        >
          <defs>
            {/* Continuous Spectrum: Emerald Green -> Cyan -> Cobalt Blue */}
            <linearGradient id="laserSpectrum" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="25%" stopColor="#10b981" />
              <stop offset="48%" stopColor="#06b6d4" />
              <stop offset="52%" stopColor="#38bdf8" />
              <stop offset="78%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Specular White Core Channel */}
            <linearGradient id="coreWhiteGlint" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.9" />
            </linearGradient>

            {/* Laser Stream Pulse Gradient */}
            <linearGradient id="laserStreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#67e8f9" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            {/* Deep Extrusion Shadow Gradient for 3D Depth */}
            <linearGradient id="shadow3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>

            {/* Starburst Radial Flare */}
            <radialGradient id="starburstGlint" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#67e8f9" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Laser Bloom Filter */}
            <filter id="laser3DBloom" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
              <feMerge>
                <feMergeNode in="b1" />
                <feMergeNode in="b2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 3D Extruded Depth Shadow (Offset layer giving 3D physical thickness) */}
          <path
            d={pathD}
            stroke="url(#shadow3D)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, 6)"
            opacity="0.9"
          />

          {/* Outer Laser Ribbon Volumetric Bloom */}
          <path
            d={pathD}
            stroke="url(#laserSpectrum)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.38"
            filter="url(#laser3DBloom)"
          />

          {/* Secondary Concentric Neon Guide Track */}
          <path
            d={innerTrackD}
            stroke="url(#laserSpectrum)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />

          {/* Primary 3D Neon Infinity Ribbon */}
          <path
            d={pathD}
            stroke="url(#laserSpectrum)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Continuous Flowing Laser Energy Stream (Animated traveling pulse) */}
          {animate && (
            <>
              <path
                d={pathD}
                stroke="url(#laserStreamGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-laser-stream"
                opacity="0.95"
              />
              <path
                d={pathD}
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-laser-fast"
                opacity="0.9"
              />
            </>
          )}

          {/* Ultra-Bright Specular Core Filament */}
          <path
            d={pathD}
            stroke="url(#coreWhiteGlint)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Center Intersection Light Flare & Pulsing Node */}
          <g transform="translate(120, 65)">
            <circle cx="0" cy="0" r="12" fill="url(#starburstGlint)" />
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="#ffffff"
              className={animate ? 'animate-ping' : ''}
              style={{ animationDuration: '2.5s' }}
            />
          </g>

          {/* Left Green Loop Starburst Glint with Sparkle */}
          <g transform="translate(34, 65)" className={animate ? 'animate-starburst' : ''}>
            <circle cx="0" cy="0" r="8" fill="url(#starburstGlint)" />
            <path
              d="M 0,-9 L 0,9 M -9,0 L 9,0"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>

          {/* Right Cobalt Blue Loop Starburst Glint with Sparkle */}
          <g transform="translate(206, 55)" className={animate ? 'animate-starburst' : ''}>
            <circle cx="0" cy="0" r="9" fill="url(#starburstGlint)" />
            <path
              d="M 0,-10 L 0,10 M -10,0 L 10,0"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>

          {/* Dynamic Floating Laser Particles */}
          {animate && (
            <>
              <circle cx="90" cy="42" r="1.5" fill="#a7f3d0" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="150" cy="88" r="1.5" fill="#93c5fd" className="animate-ping" style={{ animationDuration: '4s' }} />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

export const InfinityLogo: React.FC<InfinityLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  animate = true,
  interactive = true,
  continuous3DRotation = false,
  className = '',
  variant,
}) => {
  const isStacked = variant === 'full' || size === 'xl' || size === 'lg';

  const sizeConfigs = {
    sm: {
      iconSize: 44,
      coreText: 'text-sm sm:text-base',
      infText: 'text-[9px] sm:text-[10px]',
      taglineText: 'text-[7px]',
      container: 'gap-2',
    },
    md: {
      iconSize: 68,
      coreText: 'text-lg sm:text-xl',
      infText: 'text-[11px] sm:text-xs',
      taglineText: 'text-[8px]',
      container: 'gap-3',
    },
    lg: {
      iconSize: 140,
      coreText: 'text-2xl sm:text-3xl',
      infText: 'text-xs sm:text-sm',
      taglineText: 'text-[10px]',
      container: 'gap-3.5',
    },
    xl: {
      iconSize: 240,
      coreText: 'text-4xl sm:text-6xl',
      infText: 'text-base sm:text-xl',
      taglineText: 'text-xs sm:text-sm',
      container: 'gap-4',
    },
  };

  const cfg = sizeConfigs[size];

  return (
    <div
      className={`flex items-center ${
        isStacked ? 'flex-col text-center' : 'flex-row text-left'
      } ${cfg.container} select-none ${className}`}
    >
      {/* 3D Animated Laser Ribbon Infinity Vector Graphic with Framer Motion 3D Rotation */}
      <Infinity3DIcon
        size={cfg.iconSize}
        animate={animate}
        interactive={interactive}
        continuous3DRotation={continuous3DRotation}
      />

      {/* Typography: 3D Chrome "CORE" + Glowing Neon "INFINITY" + Tagline */}
      {showText && (
        <div className={`flex flex-col ${isStacked ? 'items-center mt-2' : 'items-start'}`}>
          {/* Main 3D Beveled Chrome "CORE" */}
          <div className="relative inline-block leading-none group">
            <h1
              className={`font-orbitron font-black tracking-wider uppercase ${cfg.coreText} relative transition-transform duration-300 group-hover:scale-[1.02]`}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.14em',
                background:
                  'linear-gradient(180deg, #ffffff 0%, #e2e8f0 20%, #94a3b8 45%, #475569 70%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:
                  'drop-shadow(0 2px 0px #0f172a) drop-shadow(0 4px 10px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(6,182,212,0.35))',
              }}
            >
              CORE
            </h1>
          </div>

          {/* Subtitle: Glowing Neon "I N F I N I T Y" (Green to Cyan to Electric Blue) */}
          <div className="mt-1">
            <span
              className={`font-orbitron font-black uppercase ${cfg.infText} block`}
              style={{
                letterSpacing: '0.36em',
                background:
                  'linear-gradient(90deg, #22c55e 0%, #10b981 25%, #06b6d4 50%, #38bdf8 75%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.75))',
              }}
            >
              INFINITY
            </span>
          </div>

          {/* Tagline: DECENTRALIZED. SECURE. LIMITLESS. */}
          {showTagline && (
            <div className="mt-1">
              <span
                className={`font-orbitron font-semibold uppercase ${cfg.taglineText} tracking-[0.24em] text-slate-300 block`}
                style={{
                  background:
                    'linear-gradient(90deg, #4ade80 0%, #38bdf8 50%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 10px rgba(6,182,212,0.4)',
                }}
              >
                DECENTRALIZED. SECURE. LIMITLESS.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
