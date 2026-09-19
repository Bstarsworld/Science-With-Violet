import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface LetterItem {
  id: string;
  char: string;
  label: string;
  scienceFact: string;
  onHoverSound: () => void;
  renderSvg: (isHovered: boolean) => React.ReactNode;
}

export const AnimatedScienceTitle: React.FC = () => {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ name: string; fact: string } | null>(null);

  const triggerSparkles = (x: number, y: number) => {
    confetti({
      particleCount: 15,
      spread: 45,
      startVelocity: 18,
      origin: { x, y },
      colors: ['#38bdf8', '#ec4899', '#facc15', '#a855f7', '#4ade80'],
    });
  };

  // 1. SCIENCE LETTERS (7 letters)
  const scienceLetters: LetterItem[] = [
    // S: Bubbly Blue + Test Tubes Rack
    {
      id: 's1',
      char: 'S',
      label: 'Solutions & Chemistry',
      scienceFact: 'Chemical reactions can change colors, bubble with gas, or release heat!',
      onHoverSound: () => soundFx.playBubble(),
      renderSvg: (h) => (
        <svg viewBox="0 0 110 110" className="w-full h-full overflow-visible">
          {/* Test Tube Rack on the left */}
          <g className={`transition-transform duration-300 ${h ? 'scale-110 -translate-y-1' : ''}`}>
            {/* Stand */}
            <rect x="6" y="58" width="28" height="42" rx="4" fill="#334155" opacity="0.8" />
            <rect x="4" y="96" width="32" height="6" rx="3" fill="#1e293b" />
            {/* Test tube 1 (Pink) */}
            <rect x="10" y="38" width="8" height="54" rx="4" fill="#f43f5e" />
            <rect x="9" y="36" width="10" height="4" rx="2" fill="#fda4af" />
            {/* Liquid shine */}
            <rect x="12" y="44" width="2" height="44" rx="1" fill="#ffffff" opacity="0.6" />
            {/* Rising bubbles */}
            <circle cx="14" cy={h ? '42' : '48'} r="1.5" fill="#ffffff" className={h ? 'animate-ping' : ''} />
            <circle cx="13" cy={h ? '52' : '60'} r="1.2" fill="#ffffff" />
            {/* Test tube 2 (Yellow) */}
            <rect x="22" y="44" width="8" height="48" rx="4" fill="#eab308" />
            <rect x="21" y="42" width="10" height="4" rx="2" fill="#fef08a" />
            <rect x="24" y="48" width="2" height="38" rx="1" fill="#ffffff" opacity="0.6" />
            <circle cx="26" cy={h ? '48' : '56'} r="1.5" fill="#ffffff" className={h ? 'animate-ping' : ''} />
          </g>
          {/* 3D Cyan-Blue Bubbly "S" */}
          <g className={`transition-transform duration-300 ${h ? 'scale-110' : ''}`}>
            {/* Shadow */}
            <path
              d="M 88 32 C 86 16 68 14 54 18 C 42 22 36 32 38 44 C 40 56 54 60 68 64 C 82 68 88 74 86 86 C 84 98 68 104 50 102 C 34 100 28 88 28 84"
              fill="none"
              stroke="#0369a1"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main vibrant blue body */}
            <path
              d="M 88 30 C 86 14 68 12 54 16 C 42 20 36 30 38 42 C 40 54 54 58 68 62 C 82 66 88 72 86 84 C 84 96 68 102 50 100 C 34 98 28 86 28 82"
              fill="none"
              stroke="#0284c7"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bright cyan core */}
            <path
              d="M 86 29 C 84 16 68 14 55 18 C 44 22 40 30 41 40 C 43 50 54 55 67 59 C 80 63 85 69 83 80 C 81 91 67 98 52 96 C 38 94 32 85 32 82"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* White glossy bubble reflections */}
            <path
              d="M 52 18 C 65 14 78 18 82 25"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 38 86 C 42 93 54 96 64 94"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="82" cy="26" r="3" fill="#ffffff" />
          </g>
        </svg>
      ),
    },

    // C: DNA Double Helix
    {
      id: 'c1',
      char: 'C',
      label: 'DNA Double Helix',
      scienceFact: 'DNA is the molecular spiral code inside every living cell on Earth!',
      onHoverSound: () => soundFx.playChime(1.1),
      renderSvg: (h) => (
        <svg viewBox="0 0 105 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-500 origin-center ${h ? 'rotate-12 scale-110' : ''}`}>
            {/* Base pair connector rungs */}
            <line x1="72" y1="20" x2="80" y2="28" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <line x1="52" y1="22" x2="62" y2="34" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
            <line x1="34" y1="36" x2="48" y2="44" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
            <line x1="26" y1="56" x2="42" y2="58" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <line x1="34" y1="74" x2="48" y2="68" stroke="#ec4899" strokeWidth="5" strokeLinecap="round" />
            <line x1="52" y1="88" x2="62" y2="78" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
            <line x1="72" y1="92" x2="80" y2="82" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />

            {/* Red Strand */}
            <path
              d="M 84 18 C 50 14 18 36 20 58 C 22 80 50 98 84 94"
              fill="none"
              stroke="#dc2626"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Blue Strand (twisted) */}
            <path
              d="M 74 28 C 42 22 28 42 36 60 C 44 78 52 86 76 82"
              fill="none"
              stroke="#2563eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Shiny DNA node beads */}
            <circle cx="84" cy="18" r="4.5" fill="#f87171" />
            <circle cx="74" cy="28" r="4.5" fill="#60a5fa" />
            <circle cx="20" cy="58" r="5" fill="#ef4444" />
            <circle cx="36" cy="60" r="4.5" fill="#3b82f6" />
            <circle cx="84" cy="94" r="4.5" fill="#f87171" />
            <circle cx="76" cy="82" r="4.5" fill="#60a5fa" />
            {h && (
              <g className="animate-spin origin-center" style={{ animationDuration: '3s' }}>
                <circle cx="50" cy="55" r="2" fill="#fef08a" />
              </g>
            )}
          </g>
        </svg>
      ),
    },

    // I: Glass Eyedropper with Glowing Potion Drop
    {
      id: 'i1',
      char: 'I',
      label: 'Chemical Pipette',
      scienceFact: 'Pipettes allow scientists to measure microscopic droplets with pin-point precision!',
      onHoverSound: () => soundFx.playDrip(),
      renderSvg: (h) => (
        <svg viewBox="0 0 80 115" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-top ${h ? 'scale-110' : ''}`}>
            {/* Rubber Suction Bulb at top */}
            <ellipse
              cx="40"
              cy="18"
              rx={h ? '18' : '15'}
              ry={h ? '11' : '13'}
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="3"
            />
            <rect x="33" y="27" width="14" height="6" rx="2" fill="#334155" />

            {/* Clear glass tube barrel */}
            <rect x="34" y="32" width="12" height="52" rx="3" fill="#e0f2fe" opacity="0.6" stroke="#94a3b8" strokeWidth="2" />

            {/* Sparkling Purple Potion Inside */}
            <rect x="36" y="44" width="8" height="38" rx="2" fill="#a855f7" />
            <rect x="37" y="46" width="2" height="34" rx="1" fill="#e9d5ff" opacity="0.8" />

            {/* Measurement tick marks */}
            <line x1="42" y1="48" x2="45" y2="48" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="40" y1="56" x2="45" y2="56" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="42" y1="64" x2="45" y2="64" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="40" y1="72" x2="45" y2="72" stroke="#ffffff" strokeWidth="1.5" />

            {/* Tapered glass nozzle */}
            <polygon points="34,84 46,84 42,94 38,94" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Falling Glowing Purple Droplet */}
            <path
              d="M 40 98 C 36 103 36 108 40 110 C 44 108 44 103 40 98 Z"
              fill="#c084fc"
              stroke="#7e22ce"
              strokeWidth="1"
              className={`transition-all duration-300 ${h ? 'translate-y-2 scale-125' : ''}`}
            />
            {h && <circle cx="40" cy="112" r="3" fill="#f0abfc" className="animate-ping" />}
          </g>
        </svg>
      ),
    },

    // E: Horseshoe Magnet with Sparks & Compass
    {
      id: 'e1',
      char: 'E',
      label: 'Electromagnetism',
      scienceFact: 'Opposite magnetic poles attract while identical poles repel each other!',
      onHoverSound: () => soundFx.playZap(),
      renderSvg: (h) => (
        <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110 rotate-3' : ''}`}>
            {/* Magnetic Horseshoe Body forming an "E" shape */}
            {/* Red North Arm */}
            <path
              d="M 84 22 L 38 22 C 26 22 18 34 18 52"
              fill="none"
              stroke="#ef4444"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Blue South Arm */}
            <path
              d="M 18 52 C 18 70 26 84 38 84 L 84 84"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Center Bar of the E */}
            <line x1="26" y1="52" x2="68" y2="52" stroke="#dc2626" strokeWidth="13" strokeLinecap="round" />

            {/* Metal Pole Tips */}
            <rect x="76" y="13" width="10" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <rect x="76" y="75" width="10" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

            {/* North & South labels */}
            <text x="44" y="27" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Fredoka">N</text>
            <text x="44" y="89" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Fredoka">S</text>

            {/* Mini Compass at lower corner */}
            <circle cx="78" cy="52" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
            <polygon points="78,41 82,52 74,52" fill="#ef4444" className={h ? 'animate-spin origin-[78px_52px]' : ''} />
            <polygon points="78,63 82,52 74,52" fill="#3b82f6" className={h ? 'animate-spin origin-[78px_52px]' : ''} />
            <circle cx="78" cy="52" r="2.5" fill="#0f172a" />

            {/* Magnetic Field Sparks */}
            {h && (
              <g className="animate-pulse">
                <path d="M 88 18 Q 96 52 88 84" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="3,3" />
                <path d="M 94 14 Q 106 52 94 88" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
              </g>
            )}
          </g>
        </svg>
      ),
    },

    // N: Erupting Volcano with Lava & Smoke
    {
      id: 'n1',
      char: 'N',
      label: 'Volcanic Geology',
      scienceFact: 'Volcanoes erupt molten rock called magma from deep inside the Earth’s mantle!',
      onHoverSound: () => soundFx.playRumble(),
      renderSvg: (h) => (
        <svg viewBox="0 0 105 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-bottom ${h ? 'scale-110 -translate-y-1' : ''}`}>
            {/* Smoke plume bursts */}
            <g className={`transition-opacity duration-300 ${h ? 'opacity-100' : 'opacity-70'}`}>
              <circle cx="48" cy={h ? '10' : '15'} r="9" fill="#94a3b8" opacity="0.8" />
              <circle cx="58" cy={h ? '7' : '12'} r="11" fill="#cbd5e1" opacity="0.9" />
              <circle cx="42" cy={h ? '14' : '18'} r="7" fill="#64748b" opacity="0.7" />
              {/* Fiery Lava Sparks */}
              <circle cx="50" cy="14" r="2.5" fill="#facc15" />
              <circle cx="56" cy="18" r="2" fill="#f97316" />
              <circle cx="62" cy="12" r="2" fill="#ef4444" />
            </g>

            {/* Brown Rocky Volcano Mountain forming "N" */}
            {/* Left pillar */}
            <polygon points="18,100 32,100 42,32 26,32" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            {/* Right pillar */}
            <polygon points="72,100 88,100 78,32 64,32" fill="#92400e" stroke="#451a03" strokeWidth="2" />
            {/* Diagonal Caldera slope */}
            <polygon points="34,36 50,30 84,100 68,100" fill="#b45309" stroke="#451a03" strokeWidth="2" />

            {/* Glowing Molten Lava Eruption at Caldera */}
            <path
              d="M 36 30 Q 52 14 68 30 Q 58 44 48 40 Z"
              fill="#ea580c"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Lava streams running down */}
            <path
              d="M 44 34 Q 48 56 42 74 Q 40 88 44 98"
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 44 34 Q 48 56 42 74 Q 40 88 44 98"
              fill="none"
              stroke="#fde047"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 54 36 Q 60 55 68 76 Q 72 90 74 98"
              fill="none"
              stroke="#ea580c"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      ),
    },

    // C: Mechanical Gears & Glowing Lightbulb
    {
      id: 'c2',
      char: 'C',
      label: 'Mechanics & Innovation',
      scienceFact: 'Gears use mechanical advantage to multiply force or speed in clocks and engines!',
      onHoverSound: () => soundFx.playZap(),
      renderSvg: (h) => (
        <svg viewBox="0 0 105 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110' : ''}`}>
            {/* Slate Blue Cogs / Gears forming the C */}
            {/* Upper Gear */}
            <g className={`origin-[62px_30px] ${h ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <circle cx="62" cy="30" r="18" fill="#475569" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="62" cy="30" r="7" fill="#94a3b8" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="59.5"
                  y="9"
                  width="5"
                  height="6"
                  rx="1"
                  fill="#334155"
                  transform={`rotate(${deg} 62 30)`}
                />
              ))}
            </g>

            {/* Back Spine Gear */}
            <g className={`origin-[30px_55px] ${h ? 'animate-spin' : ''}`} style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
              <circle cx="30" cy="55" r="22" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="30" cy="55" r="9" fill="#cbd5e1" />
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                <rect
                  key={deg}
                  x="27.5"
                  y="30"
                  width="5"
                  height="7"
                  rx="1"
                  fill="#475569"
                  transform={`rotate(${deg} 30 55)`}
                />
              ))}
            </g>

            {/* Lower Gear */}
            <g className={`origin-[62px_80px] ${h ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <circle cx="62" cy="80" r="18" fill="#475569" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="62" cy="80" r="7" fill="#94a3b8" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="59.5"
                  y="59"
                  width="5"
                  height="6"
                  rx="1"
                  fill="#334155"
                  transform={`rotate(${deg} 62 80)`}
                />
              ))}
            </g>

            {/* Bright Yellow Glowing Lightbulb inside C */}
            <circle cx="64" cy="55" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2" className={h ? 'animate-pulse' : ''} />
            <circle cx="62" cy="52" r="3" fill="#ffffff" opacity="0.8" />
            <path d="M 60 52 Q 64 48 68 52" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Screw base */}
            <rect x="58" y="68" width="12" height="6" rx="1" fill="#94a3b8" />
            <rect x="60" y="74" width="8" height="3" rx="1" fill="#64748b" />

            {/* Inspiration sparkles */}
            {h && (
              <g className="animate-ping">
                <line x1="64" y1="36" x2="64" y2="30" stroke="#fef08a" strokeWidth="2" />
                <line x1="82" y1="46" x2="88" y2="42" stroke="#fef08a" strokeWidth="2" />
                <line x1="82" y1="64" x2="88" y2="68" stroke="#fef08a" strokeWidth="2" />
              </g>
            )}
          </g>
        </svg>
      ),
    },

    // E: Night-Sky Telescope on Tripod
    {
      id: 'e2',
      char: 'E',
      label: 'Observational Astronomy',
      scienceFact: 'Telescopes gather ancient starlight traveling billions of miles across the universe!',
      onHoverSound: () => soundFx.playChime(1.4),
      renderSvg: (h) => (
        <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-bottom ${h ? 'scale-110' : ''}`}>
            {/* Deep Night Sky "E" with golden stars */}
            <path
              d="M 78 20 L 30 20 L 30 92 L 78 92 M 30 56 L 68 56"
              fill="none"
              stroke="#1e1b4b"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Starlight glow */}
            <path
              d="M 76 20 L 32 20 L 32 92 L 76 92 M 32 56 L 66 56"
              fill="none"
              stroke="#312e81"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="36" r="2.5" fill="#facc15" />
            <circle cx="34" cy="74" r="2.5" fill="#facc15" />
            <circle cx="56" cy="20" r="2" fill="#ffffff" />
            <circle cx="56" cy="92" r="2" fill="#ffffff" />

            {/* Astronomical Telescope on Tripod in front */}
            {/* Tripod Legs */}
            <line x1="68" y1="64" x2="52" y2="102" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="68" y1="64" x2="68" y2="102" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <line x1="68" y1="64" x2="84" y2="102" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            {/* Mount Pivot */}
            <circle cx="68" cy="64" r="4" fill="#0284c7" />

            {/* Telescope Barrel angled up towards stars */}
            <g className={`origin-[68px_64px] transition-transform duration-500 ${h ? 'rotate-[-12deg]' : ''}`}>
              <polygon points="48,74 88,44 92,48 52,78" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
              {/* Eyepiece */}
              <rect x="42" y="74" width="8" height="6" rx="1" fill="#e2e8f0" transform="rotate(-36 42 74)" />
              {/* Lens rim */}
              <ellipse cx="90" cy="46" rx="3.5" ry="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            </g>

            {/* Twinkling Cosmos Star */}
            <polygon
              points="94,22 96,28 102,30 96,32 94,38 92,32 86,30 92,28"
              fill="#fef08a"
              className={h ? 'animate-spin origin-[94px_30px]' : 'animate-pulse'}
            />
          </g>
        </svg>
      ),
    },
  ];

  // 2. WITH CONNECTOR ITEMS (4 items: W molecule, I lens, T prism, H flask+atom)
  const withLetters: LetterItem[] = [
    // W: Molecule Roller Tubing
    {
      id: 'w1',
      char: 'W',
      label: 'Molecules & Compounds',
      scienceFact: 'Atoms bond together like Tinkertoys to build every solid, liquid, and gas!',
      onHoverSound: () => soundFx.playPop(1.2),
      renderSvg: (h) => (
        <svg viewBox="0 0 90 90" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-115' : ''}`}>
            {/* Molecule Roller Pipe Track */}
            <path
              d="M 14 24 L 28 72 L 45 36 L 62 72 L 76 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 14 24 L 28 72 L 45 36 L 62 72 L 76 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sliding Molecule Atoms on wire */}
            <circle cx="14" cy="24" r="6.5" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
            <circle cx="28" cy="72" r="6.5" fill="#eab308" stroke="#a16207" strokeWidth="2" />
            <circle cx="45" cy="36" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="62" cy="72" r="6.5" fill="#eab308" stroke="#a16207" strokeWidth="2" />
            <circle cx="76" cy="24" r="6.5" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          </g>
        </svg>
      ),
    },

    // I: Magnifying Glass inspecting a Ladybug
    {
      id: 'i2',
      char: 'I',
      label: 'Micro-Observation & Entomology',
      scienceFact: 'Lenses bend light rays to reveal tiny details like ladybug antennae and pollen grains!',
      onHoverSound: () => soundFx.playChime(1.2),
      renderSvg: (h) => (
        <svg viewBox="0 0 85 90" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-120 rotate-6' : ''}`}>
            {/* Wooden handle */}
            <line x1="56" y1="58" x2="78" y2="82" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
            {/* Metallic rim */}
            <circle cx="40" cy="40" r="26" fill="#e0f2fe" opacity="0.6" stroke="#0284c7" strokeWidth="5" />
            {/* Glass shine */}
            <path d="M 22 28 Q 32 18 48 20" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

            {/* Red Ladybug inside lens */}
            <ellipse cx="40" cy="42" rx="12" ry="14" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="40" cy="28" r="5" fill="#0f172a" />
            {/* Center line */}
            <line x1="40" y1="28" x2="40" y2="56" stroke="#0f172a" strokeWidth="1.5" />
            {/* Spots */}
            <circle cx="35" cy="38" r="2.5" fill="#0f172a" />
            <circle cx="45" cy="38" r="2.5" fill="#0f172a" />
            <circle cx="34" cy="48" r="2" fill="#0f172a" />
            <circle cx="46" cy="48" r="2" fill="#0f172a" />
          </g>
        </svg>
      ),
    },

    // T: Prism Column with "WITH" Badge
    {
      id: 't1',
      char: 'T',
      label: 'Optics & Measurement',
      scienceFact: 'White light contains every color of the rainbow mixed together!',
      onHoverSound: () => soundFx.playFanfare(),
      renderSvg: (h) => (
        <svg viewBox="0 0 85 90" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-115' : ''}`}>
            {/* Top Bar with "WITH" Badge */}
            <rect x="8" y="14" width="68" height="20" rx="6" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
            <text x="42" y="29" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Titan One">
              WITH
            </text>

            {/* Rainbow Pillar of the T */}
            <defs>
              <linearGradient id="rainbowT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="34" y="32" width="16" height="46" rx="4" fill="url(#rainbowT)" stroke="#ffffff" strokeWidth="2" />
            <line x1="38" y1="40" x2="46" y2="40" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="38" y1="52" x2="46" y2="52" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="38" y1="64" x2="46" y2="64" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        </svg>
      ),
    },

    // H: Erlenmeyer Flask & Orbiting Atom
    {
      id: 'h1',
      char: 'H',
      label: 'Atomic Physics & Chemistry',
      scienceFact: 'Electrons orbit atomic nuclei at nearly the speed of light!',
      onHoverSound: () => soundFx.playBubble(),
      renderSvg: (h) => (
        <svg viewBox="0 0 100 90" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-115' : ''}`}>
            {/* Erlenmeyer Flask */}
            {/* Neck */}
            <rect x="22" y="16" width="12" height="18" fill="#e0f2fe" opacity="0.6" stroke="#0284c7" strokeWidth="2" />
            <rect x="20" y="14" width="16" height="4" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            {/* Conical Body */}
            <polygon points="22,32 34,32 50,72 6,72" fill="#e0f2fe" opacity="0.7" stroke="#0284c7" strokeWidth="2" />
            {/* Rainbow / Pink Potion Inside */}
            <polygon points="17,50 39,50 48,70 8,70" fill="#ec4899" />
            <circle cx="24" cy={h ? '44' : '54'} r="2" fill="#ffffff" className={h ? 'animate-ping' : ''} />
            <circle cx="32" cy={h ? '48' : '58'} r="1.5" fill="#ffffff" />

            {/* Atomic Orbit Model beside it */}
            <g className={`origin-[72px_45px] ${h ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
              {/* Orbit Rings */}
              <ellipse cx="72" cy="45" rx="22" ry="9" fill="none" stroke="#a855f7" strokeWidth="1.8" transform="rotate(30 72 45)" />
              <ellipse cx="72" cy="45" rx="22" ry="9" fill="none" stroke="#06b6d4" strokeWidth="1.8" transform="rotate(-30 72 45)" />
              <ellipse cx="72" cy="45" rx="22" ry="9" fill="none" stroke="#f59e0b" strokeWidth="1.8" transform="rotate(90 72 45)" />
              {/* Nucleus Planet */}
              <circle cx="72" cy="45" r="7" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
              {/* Orbiting Electrons */}
              <circle cx="88" cy="38" r="3" fill="#38bdf8" />
              <circle cx="56" cy="52" r="3" fill="#eab308" />
              <circle cx="72" cy="23" r="3" fill="#ec4899" />
            </g>
          </g>
        </svg>
      ),
    },
  ];

  // 3. VIOLET LETTERS (6 letters)
  const violetLetters: LetterItem[] = [
    // V: Royal Violet with Glass Prism & Rainbow Beam
    {
      id: 'v1',
      char: 'V',
      label: 'Light Refraction & Prisms',
      scienceFact: 'Isaac Newton discovered that glass prisms split sunbeams into seven rainbow wavelengths!',
      onHoverSound: () => soundFx.playFanfare(),
      renderSvg: (h) => (
        <svg viewBox="0 0 115 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110' : ''}`}>
            {/* Vibrant Purple 3D Letter V */}
            <path
              d="M 22 20 L 52 94 L 82 20"
              fill="none"
              stroke="#7e22ce"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 22 20 L 52 94 L 82 20"
              fill="none"
              stroke="#a855f7"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White polka dots / sparkles on V */}
            <circle cx="30" cy="34" r="2.5" fill="#ffffff" />
            <circle cx="42" cy="62" r="2.5" fill="#ffffff" />
            <circle cx="74" cy="34" r="2.5" fill="#ffffff" />

            {/* Glass Triangular Prism in front */}
            <polygon
              points="42,54 62,54 52,36"
              fill="#e0f2fe"
              opacity="0.85"
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* 7-Color Rainbow Beam shooting out to the right */}
            <g className={`transition-all duration-300 ${h ? 'scale-110 opacity-100' : 'opacity-90'}`}>
              <path d="M 58 46 Q 84 40 112 40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <path d="M 58 48 Q 84 43 112 43" fill="none" stroke="#f97316" strokeWidth="2.5" />
              <path d="M 58 50 Q 84 46 112 46" fill="none" stroke="#eab308" strokeWidth="2.5" />
              <path d="M 58 52 Q 84 49 112 49" fill="none" stroke="#22c55e" strokeWidth="2.5" />
              <path d="M 58 54 Q 84 52 112 52" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
              <path d="M 58 56 Q 84 55 112 55" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              <path d="M 58 58 Q 84 58 112 58" fill="none" stroke="#a855f7" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      ),
    },

    // I: Bubbling Pink Potion Test Tube
    {
      id: 'i3',
      char: 'I',
      label: 'Effervescence & Fluids',
      scienceFact: 'Effervescence is the rapid escape of gas bubbles from a fizzy chemical reaction!',
      onHoverSound: () => soundFx.playBubble(),
      renderSvg: (h) => (
        <svg viewBox="0 0 75 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110 -translate-y-1' : ''}`}>
            {/* Glass Tube Body */}
            <rect x="26" y="24" width="22" height="70" rx="11" fill="#fdf4ff" opacity="0.6" stroke="#c084fc" strokeWidth="3" />
            <rect x="22" y="20" width="30" height="6" rx="3" fill="#f5d0fe" stroke="#a855f7" strokeWidth="2" />

            {/* Glowing Pink Potion Fluid */}
            <rect x="29" y="44" width="16" height="48" rx="8" fill="#ec4899" />
            <rect x="31" y="46" width="3" height="42" rx="1.5" fill="#fbcfe8" opacity="0.8" />

            {/* Bubbles foaming over */}
            <circle cx="36" cy={h ? '28' : '36'} r="3.5" fill="#f472b6" className={h ? 'animate-bounce' : ''} />
            <circle cx="42" cy={h ? '22' : '30'} r="4" fill="#fbcfe8" className={h ? 'animate-ping' : ''} />
            <circle cx="32" cy={h ? '18' : '26'} r="2.5" fill="#f472b6" />
            <circle cx="37" cy="54" r="2" fill="#ffffff" />
            <circle cx="41" cy="68" r="2.5" fill="#ffffff" />
            <circle cx="35" cy="80" r="2" fill="#ffffff" />
          </g>
        </svg>
      ),
    },

    // O: Saturn Ringed Planet with Stars
    {
      id: 'o1',
      char: 'O',
      label: 'Gas Giants & Planetary Rings',
      scienceFact: 'Saturn’s rings are made of billions of chunks of glittering ice and space dust!',
      onHoverSound: () => soundFx.playWhoosh(),
      renderSvg: (h) => (
        <svg viewBox="0 0 115 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-500 origin-center ${h ? 'scale-115 rotate-12' : ''}`}>
            {/* Celestial Planet Sphere */}
            <defs>
              <radialGradient id="saturnAtmosphere" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="40%" stopColor="#fb923c" />
                <stop offset="80%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#4c1d95" />
              </radialGradient>
            </defs>
            <circle cx="56" cy="55" r="28" fill="url(#saturnAtmosphere)" stroke="#fed7aa" strokeWidth="2" />

            {/* Atmosphere bands */}
            <path d="M 32 46 Q 56 54 80 46" fill="none" stroke="#ffedd5" strokeWidth="3" opacity="0.6" />
            <path d="M 30 58 Q 56 66 82 58" fill="none" stroke="#f472b6" strokeWidth="2.5" opacity="0.6" />

            {/* Glowing Golden Planetary Rings */}
            <ellipse
              cx="56"
              cy="55"
              rx="48"
              ry="16"
              fill="none"
              stroke="#fef08a"
              strokeWidth="6"
              transform="rotate(-24 56 55)"
              strokeDasharray="90 12"
            />
            <ellipse
              cx="56"
              cy="55"
              rx="43"
              ry="12"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              transform="rotate(-24 56 55)"
            />

            {/* Twinkling Cosmic Stars */}
            <circle cx="16" cy="24" r="2.5" fill="#fde047" className={h ? 'animate-ping' : ''} />
            <circle cx="98" cy="84" r="2" fill="#ffffff" />
            <circle cx="88" cy="22" r="1.5" fill="#fde047" />
          </g>
        </svg>
      ),
    },

    // L: Ancient Dinosaur Fossil Stone Slab
    {
      id: 'l1',
      char: 'L',
      label: 'Paleontology & Fossils',
      scienceFact: 'Fossils are the stone cast impressions of animals preserved over 65 million years!',
      onHoverSound: () => soundFx.playRumble(),
      renderSvg: (h) => (
        <svg viewBox="0 0 95 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-bottom ${h ? 'scale-110 rotate-[-4deg]' : ''}`}>
            {/* Weathered Stone Slab forming "L" */}
            <path
              d="M 22 22 Q 26 14 38 16 Q 48 18 52 24 L 50 68 L 84 66 Q 92 70 90 82 Q 88 94 76 96 L 26 96 Q 16 92 18 80 Z"
              fill="#d6c3a5"
              stroke="#78593a"
              strokeWidth="3"
            />
            {/* Stone Cracks & Texture */}
            <path d="M 36 28 L 44 38 L 40 46" fill="none" stroke="#8c6a49" strokeWidth="1.5" />
            <path d="M 68 76 L 74 86" fill="none" stroke="#8c6a49" strokeWidth="1.5" />

            {/* Embossed 3-Toed Dinosaur Footprint */}
            <g transform="translate(26, 32)">
              {/* Heel pad */}
              <ellipse cx="14" cy="18" rx="6" ry="5" fill="#543820" />
              {/* Center claw */}
              <path d="M 14 14 L 14 2" fill="none" stroke="#543820" strokeWidth="4.5" strokeLinecap="round" />
              {/* Left claw */}
              <path d="M 10 16 L 3 8" fill="none" stroke="#543820" strokeWidth="4" strokeLinecap="round" />
              {/* Right claw */}
              <path d="M 18 16 L 25 8" fill="none" stroke="#543820" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Ancient Dinosaur Bone embedded underneath */}
            <g transform="translate(34, 76)">
              <rect x="6" y="4" width="28" height="6" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="6" cy="4" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="6" cy="10" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="34" cy="4" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="34" cy="10" r="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            </g>
          </g>
        </svg>
      ),
    },

    // E: Robotic Mechanical Arm with Grabber Claws & Gears
    {
      id: 'e3',
      char: 'E',
      label: 'Robotics & Automation',
      scienceFact: 'Robotic arms on Mars rovers use servo motors and hydraulic grippers to collect soil samples!',
      onHoverSound: () => soundFx.playZap(),
      renderSvg: (h) => (
        <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110' : ''}`}>
            {/* Vertical Arm Spine */}
            <rect x="24" y="20" width="14" height="74" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />

            {/* Top Grabber Prong of E */}
            <g className={`origin-[38px_26px] transition-transform duration-300 ${h ? 'rotate-[-8deg]' : ''}`}>
              <rect x="34" y="22" width="28" height="10" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <circle cx="38" cy="27" r="4" fill="#ea580c" />
              {/* Robotic Claw Gripper */}
              <path d="M 62 20 Q 76 20 76 27 Q 76 34 62 34" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Center Wrench/Lever Prong of E */}
            <g className={`origin-[38px_56px] transition-transform duration-300 ${h ? 'scale-110' : ''}`}>
              <rect x="34" y="52" width="24" height="9" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <circle cx="38" cy="56.5" r="4" fill="#ea580c" />
              {/* Articulated joint arm */}
              <polygon points="56,53 74,48 76,54 58,59" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
              <circle cx="75" cy="51" r="3.5" fill="#ea580c" />
            </g>

            {/* Bottom Gear/Base Prong of E */}
            <g className={`origin-[38px_86px] transition-transform duration-300 ${h ? 'rotate-[8deg]' : ''}`}>
              <rect x="34" y="82" width="28" height="10" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <circle cx="38" cy="87" r="4" fill="#ea580c" />
              {/* Mechanical Gear Base */}
              <circle cx="70" cy="87" r="10" fill="#f59e0b" stroke="#b45309" strokeWidth="2" className={h ? 'animate-spin origin-[70px_87px]' : ''} />
              <circle cx="70" cy="87" r="3.5" fill="#334155" />
            </g>
          </g>
        </svg>
      ),
    },

    // T: Celestial Navigation Compass with Stars & Gears
    {
      id: 't2',
      char: 'T',
      label: 'Navigation & Earth Magnetism',
      scienceFact: 'A magnetic compass aligns with Earth’s magnetic field lines pointing toward the poles!',
      onHoverSound: () => soundFx.playChime(1.3),
      renderSvg: (h) => (
        <svg viewBox="0 0 105 110" className="w-full h-full overflow-visible">
          <g className={`transition-transform duration-300 origin-center ${h ? 'scale-110' : ''}`}>
            {/* Navy Celestial Bar of T */}
            <rect x="12" y="18" width="80" height="18" rx="6" fill="#1e1b4b" stroke="#312e81" strokeWidth="2.5" />
            {/* Stars on top bar */}
            <polygon points="24,24 25,27 28,27 25,29 26,32 24,30 22,32 23,29 20,27 23,27" fill="#facc15" />
            <polygon points="78,24 79,27 82,27 79,29 80,32 78,30 76,32 77,29 74,27 77,27" fill="#facc15" />
            <text x="52" y="32" fill="#fde047" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Titan One">
              N
            </text>

            {/* Vertical Stem of T */}
            <rect x="44" y="32" width="16" height="42" rx="4" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />

            {/* Rotating Brass Compass Dial at Base */}
            <g className={`origin-[52px_80px] ${h ? 'scale-115' : ''}`}>
              <circle cx="52" cy="80" r="20" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
              <circle cx="52" cy="80" r="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="52" y="69" fill="#0369a1" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
              <text x="52" y="96" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">S</text>
              <text x="64" y="83" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">E</text>
              <text x="40" y="83" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">W</text>

              {/* Compass Needle */}
              <g className={`origin-[52px_80px] ${h ? 'animate-spin' : ''}`} style={{ animationDuration: '2.5s' }}>
                <polygon points="52,66 56,80 48,80" fill="#ef4444" />
                <polygon points="52,94 56,80 48,80" fill="#3b82f6" />
                <circle cx="52" cy="80" r="3" fill="#facc15" stroke="#78350f" strokeWidth="1" />
              </g>
            </g>

            {/* Rotating Gear on side */}
            <circle cx="82" cy="50" r="9" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" className={h ? 'animate-spin origin-[82px_50px]' : ''} />
            <circle cx="82" cy="50" r="3" fill="#e2e8f0" />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative z-30 flex flex-col items-center justify-center select-none pointer-events-auto w-full max-w-6xl mx-auto px-1 sm:px-2 pt-0.5">
      {/* ALL ON ONE SINGLE LINE: SCIENCE WITH VIOLET */}
      <div className="flex items-center justify-center flex-nowrap gap-0.5 sm:gap-1 md:gap-2 max-w-full overflow-x-auto py-1 px-1 scrollbar-none">
        {/* 1. SCIENCE (7 letters) */}
        <div className="flex items-center flex-nowrap gap-0.5 sm:gap-1 md:gap-1.5 mr-2 sm:mr-3 md:mr-4">
          {scienceLetters.map((item) => {
            const isH = hoveredLetter === item.id;
            return (
              <div
                key={item.id}
                id={`title-letter-${item.id}`}
                onMouseEnter={(e) => {
                  setHoveredLetter(item.id);
                  setActiveTooltip({ name: item.label, fact: item.scienceFact });
                  item.onHoverSound();
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerSparkles((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
                }}
                onMouseLeave={() => {
                  setHoveredLetter(null);
                  setActiveTooltip(null);
                }}
                onClick={() => {
                  item.onHoverSound();
                  soundFx.playPop(1.3);
                }}
                className="relative w-6 h-7.5 sm:w-8.5 sm:h-11 md:w-11 md:h-14 lg:w-13.5 lg:h-17 xl:w-15 xl:h-19 cursor-pointer transition-transform duration-200 hover:scale-130 hover:-translate-y-2 filter drop-shadow-[0_4px_8px_rgba(45,10,80,0.5)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] flex-shrink-0"
                title={`${item.char} - ${item.label}`}
              >
                {item.renderSvg(isH)}
              </div>
            );
          })}
        </div>

        {/* 2. WITH (4 connector items) */}
        <div className="flex items-center flex-nowrap gap-0.5 sm:gap-1 md:gap-1.5 mr-2 sm:mr-3 md:mr-4">
          {withLetters.map((item) => {
            const isH = hoveredLetter === item.id;
            return (
              <div
                key={item.id}
                id={`title-letter-${item.id}`}
                onMouseEnter={(e) => {
                  setHoveredLetter(item.id);
                  setActiveTooltip({ name: item.label, fact: item.scienceFact });
                  item.onHoverSound();
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerSparkles((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
                }}
                onMouseLeave={() => {
                  setHoveredLetter(null);
                  setActiveTooltip(null);
                }}
                onClick={() => {
                  item.onHoverSound();
                  soundFx.playPop(1.3);
                }}
                className="relative w-5.5 h-7 sm:w-7.5 sm:h-9.5 md:w-9.5 md:h-12 lg:w-12 lg:h-15 xl:w-13 xl:h-17 cursor-pointer transition-transform duration-200 hover:scale-130 hover:-translate-y-1.5 filter drop-shadow-[0_3px_7px_rgba(45,10,80,0.45)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] flex-shrink-0"
                title={item.label}
              >
                {item.renderSvg(isH)}
              </div>
            );
          })}
        </div>

        {/* 3. VIOLET (6 letters) */}
        <div className="flex items-center flex-nowrap gap-0.5 sm:gap-1 md:gap-1.5">
          {violetLetters.map((item) => {
            const isH = hoveredLetter === item.id;
            return (
              <div
                key={item.id}
                id={`title-letter-${item.id}`}
                onMouseEnter={(e) => {
                  setHoveredLetter(item.id);
                  setActiveTooltip({ name: item.label, fact: item.scienceFact });
                  item.onHoverSound();
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerSparkles((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
                }}
                onMouseLeave={() => {
                  setHoveredLetter(null);
                  setActiveTooltip(null);
                }}
                onClick={() => {
                  item.onHoverSound();
                  soundFx.playPop(1.3);
                }}
                className="relative w-6 h-7.5 sm:w-8.5 sm:h-11 md:w-11 md:h-14 lg:w-13.5 lg:h-17 xl:w-15 xl:h-19 cursor-pointer transition-transform duration-200 hover:scale-130 hover:-translate-y-2 filter drop-shadow-[0_4px_8px_rgba(45,10,80,0.5)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] flex-shrink-0"
                title={`${item.char} - ${item.label}`}
              >
                {item.renderSvg(isH)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Science Trivia Tooltip (Only appears during active letter hover, without pushing other elements) */}
      {activeTooltip && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none z-40 animate-in fade-in zoom-in-95 duration-150 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-purple-300 shadow-xl flex items-center gap-2 max-w-lg text-center whitespace-nowrap">
          <span className="text-xs font-['Titan_One'] text-purple-700 uppercase tracking-wide">
            {activeTooltip.name}:
          </span>
          <span className="text-xs font-bold text-purple-950">
            {activeTooltip.fact}
          </span>
        </div>
      )}
    </div>
  );
};
