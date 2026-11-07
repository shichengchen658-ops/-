import React from 'react';

interface AnimalIllustrationProps {
  animalId: string;
  state: 'idle' | 'hungry' | 'eating' | 'yuck';
  className?: string;
}

export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  state,
  className = 'w-48 h-48',
}) => {
  const isEating = state === 'eating';
  const isYuck = state === 'yuck';

  // Cute little egret (白鹭)
  if (animalId === 'little_egret') {
    return (
      <div className={`relative flex items-center justify-center ${className} ${isEating ? 'animate-munch' : isYuck ? 'animate-shake' : 'animate-float-slow'}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Subtle water ripple shadow */}
          <ellipse cx="100" cy="180" rx="60" ry="12" fill="#0d9488" opacity="0.2" />

          {/* Long slender legs */}
          <path d="M85 140 L85 180 M98 140 L98 180" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <path d="M78 180 L92 180 M92 180 L105 180" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

          {/* Plump pure white body */}
          <path d="M60 120 C50 90 80 65 110 75 C140 85 155 120 135 140 C115 155 80 150 60 120 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />

          {/* Wing with feather details */}
          <path d="M70 100 C80 90 120 95 130 115 C115 130 90 130 70 115 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />

          {/* Long graceful neck */}
          <path d="M105 80 C110 55 90 35 105 20 C115 15 125 25 120 40 C115 55 125 75 120 85" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />

          {/* Head */}
          <circle cx="108" cy="28" r="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />

          {/* Yellow eye area & eye */}
          <ellipse cx="100" cy="26" rx="8" ry="6" fill="#fef08a" />
          {isYuck ? (
            <text x="96" y="30" fontSize="13" fontWeight="bold" fill="#0f172a">✖</text>
          ) : isEating ? (
            <path d="M96 28 Q100 22 104 28" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <circle cx="100" cy="26" r="3.5" fill="#0f172a" />
          )}

          {/* Crest / Plume feather on head */}
          <path d="M120 22 Q145 15 155 25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M118 26 Q140 22 150 32" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Yellow/Black Spear Beak */}
          {isEating ? (
            <g>
              <polygon points="90,24 45,20 85,28" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <polygon points="90,32 45,36 85,28" fill="#ca8a04" stroke="#a16207" strokeWidth="2" />
            </g>
          ) : (
            <polygon points="92,23 38,28 92,33" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          )}

          {/* Cheerful blush */}
          {!isYuck && <circle cx="112" cy="36" r="5" fill="#f43f5e" opacity="0.3" />}

          {/* Heart / sparkles when eating */}
          {isEating && (
            <g className="animate-bounce">
              <text x="140" y="30" fontSize="22">💖</text>
              <text x="35" y="45" fontSize="18">✨</text>
            </g>
          )}

          {/* Sweat drop when yuck */}
          {isYuck && (
            <g>
              <text x="130" y="35" fontSize="20">💧</text>
              <text x="40" y="45" fontSize="20">🤢</text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Cute Fiddler Crab (招潮蟹)
  if (animalId === 'fiddler_crab') {
    return (
      <div className={`relative flex items-center justify-center ${className} ${isEating ? 'animate-munch' : isYuck ? 'animate-shake' : 'animate-float-slow'}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Mud shadow */}
          <ellipse cx="100" cy="175" rx="65" ry="12" fill="#78350f" opacity="0.25" />

          {/* Walking legs */}
          <path d="M50 145 Q30 160 25 175 M60 150 Q45 168 40 180 M150 145 Q170 160 175 175 M140 150 Q155 168 160 180" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Giant Famous Waving Claw (Right side) */}
          <g transform="translate(130, 70) rotate(-15)">
            <ellipse cx="30" cy="20" rx="35" ry="24" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
            <path d="M45 5 Q70 0 65 25" stroke="#f87171" strokeWidth="6" strokeLinecap="round" fill="none" />
            <polygon points="50,10 80,18 55,28" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="52,24 75,32 50,35" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          </g>

          {/* Small Left Claw (feeding claw) */}
          <g transform="translate(45, 120)">
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
            <polygon points="-8,-6 -18,-10 -12,2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          </g>

          {/* Main Crab Carapace Shell */}
          <rect x="55" y="100" width="90" height="65" rx="30" fill="#ea580c" stroke="#c2410c" strokeWidth="4" />
          {/* Shell decorative stripes */}
          <path d="M68 115 Q100 125 132 115" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Eye stalks */}
          <line x1="85" y1="102" x2="80" y2="75" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
          <line x1="115" y1="102" x2="120" y2="75" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />

          {/* Big bulbous eyes */}
          <circle cx="80" cy="73" r="14" fill="#ffffff" stroke="#c2410c" strokeWidth="2.5" />
          <circle cx="120" cy="73" r="14" fill="#ffffff" stroke="#c2410c" strokeWidth="2.5" />

          {isYuck ? (
            <>
              <text x="74" y="78" fontSize="14" fontWeight="bold" fill="#0f172a">✖</text>
              <text x="114" y="78" fontSize="14" fontWeight="bold" fill="#0f172a">✖</text>
            </>
          ) : isEating ? (
            <>
              <path d="M74 74 Q80 67 86 74" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M114 74 Q120 67 126 74" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="80" cy="73" r="6" fill="#0f172a" />
              <circle cx="78" cy="70" r="2" fill="#ffffff" />
              <circle cx="120" cy="73" r="6" fill="#0f172a" />
              <circle cx="118" cy="70" r="2" fill="#ffffff" />
            </>
          )}

          {/* Cute Mouth */}
          {isEating ? (
            <ellipse cx="100" cy="142" rx="12" ry="8" fill="#991b1b" />
          ) : isYuck ? (
            <path d="M90 146 Q100 138 110 146" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M92 138 Q100 148 108 138" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* Blushes */}
          {!isYuck && (
            <>
              <circle cx="72" cy="135" r="6" fill="#fda4af" opacity="0.6" />
              <circle cx="128" cy="135" r="6" fill="#fda4af" opacity="0.6" />
            </>
          )}

          {isEating && <text x="135" y="55" fontSize="22">😋</text>}
          {isYuck && <text x="25" y="75" fontSize="22">🤢</text>}
        </svg>
      </div>
    );
  }

  // Cute Mudskipper (弹涂鱼 / 跳跳鱼)
  if (animalId === 'mudskipper') {
    return (
      <div className={`relative flex items-center justify-center ${className} ${isEating ? 'animate-munch' : isYuck ? 'animate-shake' : 'animate-float-slow'}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Mud base shadow */}
          <ellipse cx="100" cy="170" rx="65" ry="14" fill="#065f46" opacity="0.25" />

          {/* Fish Tail */}
          <path d="M45 130 C20 115 15 140 25 155 C35 150 45 142 50 138 Z" fill="#059669" stroke="#047857" strokeWidth="3" />

          {/* Spiky Spotted Dorsal Fin */}
          <path d="M70 95 Q90 60 110 85 Q125 55 140 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="#34d399" opacity="0.8" />
          <circle cx="90" cy="72" r="3" fill="#047857" />
          <circle cx="125" cy="70" r="3" fill="#047857" />

          {/* Main Body */}
          <ellipse cx="105" cy="125" rx="65" ry="34" fill="#10b981" stroke="#047857" strokeWidth="3.5" />
          {/* Belly */}
          <path d="M60 135 C80 155 130 155 155 135 Z" fill="#a7f3d0" />

          {/* Muscular pectoral fin "arms" propped on mud */}
          <path d="M125 135 Q145 155 140 168 Q125 165 118 145 Z" fill="#059669" stroke="#047857" strokeWidth="3" />
          <path d="M85 135 Q70 155 72 168 Q85 165 92 145 Z" fill="#059669" stroke="#047857" strokeWidth="3" />

          {/* Big protruding bulbous eyes on TOP of head */}
          <circle cx="135" cy="85" r="17" fill="#ffffff" stroke="#047857" strokeWidth="3" />
          <circle cx="158" cy="88" r="16" fill="#ffffff" stroke="#047857" strokeWidth="3" />

          {isYuck ? (
            <>
              <text x="129" y="90" fontSize="15" fontWeight="bold" fill="#0f172a">✖</text>
              <text x="153" y="93" fontSize="15" fontWeight="bold" fill="#0f172a">✖</text>
            </>
          ) : isEating ? (
            <>
              <path d="M128 85 Q135 78 142 85" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M152 88 Q158 81 165 88" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="136" cy="85" r="7" fill="#0f172a" />
              <circle cx="134" cy="82" r="2.5" fill="#ffffff" />
              <circle cx="160" cy="88" r="7" fill="#0f172a" />
              <circle cx="158" cy="85" r="2.5" fill="#ffffff" />
            </>
          )}

          {/* Mouth */}
          {isEating ? (
            <ellipse cx="165" cy="125" rx="8" ry="10" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
          ) : isYuck ? (
            <path d="M158 130 Q165 120 172 130" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M158 122 Q166 132 173 122" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* Body spots */}
          <circle cx="85" cy="118" r="3.5" fill="#065f46" />
          <circle cx="105" cy="112" r="4" fill="#065f46" />
          <circle cx="120" cy="120" r="3" fill="#065f46" />

          {/* Blush */}
          {!isYuck && <circle cx="145" cy="118" r="6" fill="#f43f5e" opacity="0.4" />}
          {isEating && <text x="145" y="45" fontSize="22">🥳</text>}
        </svg>
      </div>
    );
  }

  // Cute Tilapia Fish (罗非鱼)
  if (animalId === 'tilapia_fish') {
    return (
      <div className={`relative flex items-center justify-center ${className} ${isEating ? 'animate-munch' : isYuck ? 'animate-shake' : 'animate-float-slow'}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Water ripple */}
          <ellipse cx="100" cy="175" rx="60" ry="12" fill="#0284c7" opacity="0.25" />

          {/* Tail Fin */}
          <path d="M45 100 C15 70 15 130 45 100 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
          <path d="M25 85 L45 100 L25 115" stroke="#38bdf8" strokeWidth="2" fill="none" />

          {/* Dorsal Fin with spikes */}
          <path d="M70 70 Q110 40 145 70" stroke="#0369a1" strokeWidth="4" fill="#38bdf8" strokeLinecap="round" />
          <line x1="85" y1="62" x2="85" y2="75" stroke="#0284c7" strokeWidth="2" />
          <line x1="105" y1="55" x2="105" y2="75" stroke="#0284c7" strokeWidth="2" />
          <line x1="125" y1="58" x2="125" y2="75" stroke="#0284c7" strokeWidth="2" />

          {/* Fish Body */}
          <ellipse cx="105" cy="105" rx="60" ry="38" fill="#38bdf8" stroke="#0284c7" strokeWidth="3.5" />
          {/* Belly gradient */}
          <path d="M60 115 Q105 145 150 115 Z" fill="#e0f2fe" />

          {/* Lateral stripes */}
          <path d="M80 85 Q82 105 80 125" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M100 80 Q102 105 100 130" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M120 85 Q122 105 120 125" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />

          {/* Pectoral Fin */}
          <path d="M110 110 Q95 125 115 130 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />

          {/* Big fish eye */}
          <circle cx="145" cy="95" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
          {isYuck ? (
            <text x="139" y="100" fontSize="14" fontWeight="bold" fill="#0f172a">✖</text>
          ) : isEating ? (
            <path d="M140 95 Q145 88 150 95" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <>
              <circle cx="146" cy="95" r="6" fill="#0f172a" />
              <circle cx="144" cy="93" r="2" fill="#ffffff" />
            </>
          )}

          {/* Round fish mouth */}
          {isEating ? (
            <circle cx="166" cy="110" r="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
          ) : isYuck ? (
            <path d="M160 115 Q165 108 170 115" stroke="#075985" strokeWidth="3" fill="none" />
          ) : (
            <ellipse cx="165" cy="110" rx="5" ry="6" fill="#075985" />
          )}

          {/* Bubbles */}
          <circle cx="178" cy="90" r="4" fill="#bae6fd" opacity="0.8" />
          <circle cx="188" cy="78" r="6" fill="#bae6fd" opacity="0.6" />

          {isEating && <text x="140" y="45" fontSize="22">🐟✨</text>}
        </svg>
      </div>
    );
  }

  // Microscopic Daphnia / Water flea (微型水蚤)
  return (
    <div className={`relative flex items-center justify-center ${className} ${isEating ? 'animate-munch' : isYuck ? 'animate-shake' : 'animate-float-slow'}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Glow */}
        <circle cx="100" cy="100" r="75" fill="#c4b5fd" opacity="0.25" />

        {/* Translucent water flea shell */}
        <path d="M85 50 C135 45 160 85 150 140 C140 165 105 170 85 155 C65 140 60 70 85 50 Z" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="3.5" opacity="0.9" />

        {/* Pulsing internal heart & gut */}
        <circle cx="105" cy="95" r="10" fill="#f43f5e" opacity="0.75" />
        <path d="M105 105 Q100 135 110 145" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Large compound eye with sparkles */}
        <circle cx="120" cy="65" r="12" fill="#0f172a" />
        {isYuck ? (
          <text x="114" y="70" fontSize="12" fontWeight="bold" fill="#ffffff">✖</text>
        ) : (
          <circle cx="118" cy="62" r="4" fill="#ffffff" />
        )}

        {/* Branched Swimming Antennae (paddles) */}
        <path d="M125 50 Q160 25 180 35 M160 25 Q175 10 185 15" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M110 45 Q135 15 150 10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Spiny tail spine */}
        <path d="M85 155 Q75 185 70 190" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" />

        {/* Mouth */}
        {isEating ? (
          <circle cx="135" cy="80" r="6" fill="#991b1b" />
        ) : (
          <path d="M130 80 Q135 84 138 80" stroke="#5b21b6" strokeWidth="2.5" fill="none" />
        )}

        {isEating && <text x="145" y="45" fontSize="22">💚🌱</text>}
        {isYuck && <text x="35" y="55" fontSize="22">😵‍💫</text>}
      </svg>
    </div>
  );
};
