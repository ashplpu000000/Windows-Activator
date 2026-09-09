import React from 'react';

interface WindowsOrbitLogoProps {
  className?: string;
  showBackground?: boolean;
}

export const WindowsOrbitLogo: React.FC<WindowsOrbitLogoProps> = ({
  className = 'h-8 w-auto',
  showBackground = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 240"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="win-glow-orange" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="win-glow-star" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients for Flag Panes */}
        <linearGradient id="win-redGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="45%" stopColor="#e01b1b" />
          <stop offset="100%" stopColor="#990b0b" />
        </linearGradient>
        <linearGradient id="win-redGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ff9999" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="win-greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34c759" />
          <stop offset="45%" stopColor="#24a838" />
          <stop offset="100%" stopColor="#11681b" />
        </linearGradient>
        <linearGradient id="win-greenGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#bbf7c5" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="win-blueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#007aff" />
          <stop offset="45%" stopColor="#0055d4" />
          <stop offset="100%" stopColor="#002b80" />
        </linearGradient>
        <linearGradient id="win-blueGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#80beff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="win-yellowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffcc00" />
          <stop offset="45%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#b36200" />
        </linearGradient>
        <linearGradient id="win-yellowGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffe680" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Gold Bevel for Borders */}
        <linearGradient id="win-goldBorder" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe875" />
          <stop offset="35%" stopColor="#ffc400" />
          <stop offset="70%" stopColor="#e69500" />
          <stop offset="100%" stopColor="#ffd54f" />
        </linearGradient>

        {/* Orbit Gradients */}
        <linearGradient id="win-orbitGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="25%" stopColor="#ff9a00" />
          <stop offset="50%" stopColor="#ffd200" />
          <stop offset="75%" stopColor="#4cd964" />
          <stop offset="92%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#00aaff" />
        </linearGradient>

        <linearGradient id="win-innerOrbitGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffaa00" />
          <stop offset="40%" stopColor="#fff066" />
          <stop offset="70%" stopColor="#70ff8b" />
          <stop offset="90%" stopColor="#66f0ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Optional Background matching user's original image */}
      {showBackground && (
        <rect width="100%" height="100%" fill="#323a46" rx="8" />
      )}

      {/* Orbit Ring: Rear Loop (behind top flag) */}
      <g opacity="0.95">
        <path
          d="M 230 46 C 265 43, 295 45, 320 54"
          fill="none"
          stroke="#ffe270"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#win-glow-star)"
        />
        <path
          d="M 98 90 C 130 52, 230 36, 320 54"
          fill="none"
          stroke="url(#win-orbitGrad)"
          strokeWidth="4.5"
          opacity="0.75"
        />
        <path
          d="M 98 90 C 130 52, 230 36, 320 54"
          fill="none"
          stroke="#fff8b0"
          strokeWidth="1.8"
          opacity="0.9"
        />
      </g>

      {/* ================= WINDOWS 4-PANE FLAG ================= */}
      <g transform="translate(18, 5) scale(0.96)">
        {/* Red Pane */}
        <g>
          <path
            d="M 116 42 C 142 35, 172 38, 202 48 C 196 79, 192 108, 186 137 C 158 126, 130 126, 104 133 C 109 102, 112 72, 116 42 Z"
            fill="url(#win-redGrad)"
            stroke="url(#win-goldBorder)"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M 119 46 C 143 40, 169 43, 198 52 C 195 72, 193 85, 190 92 C 165 78, 140 76, 110 88 C 113 72, 116 58, 119 46 Z"
            fill="url(#win-redGloss)"
            opacity="0.65"
          />
        </g>

        {/* Green Pane */}
        <g>
          <path
            d="M 213 51 C 243 61, 269 57, 286 49 C 281 79, 276 109, 271 138 C 253 146, 229 148, 201 140 C 205 110, 209 81, 213 51 Z"
            fill="url(#win-greenGrad)"
            stroke="url(#win-goldBorder)"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M 216 55 C 242 64, 265 61, 282 53 C 279 73, 276 86, 273 95 C 255 99, 235 96, 209 88 C 211 75, 214 65, 216 55 Z"
            fill="url(#win-greenGloss)"
            opacity="0.65"
          />
        </g>

        {/* Blue Pane */}
        <g>
          <path
            d="M 100 146 C 128 138, 157 138, 183 150 C 178 181, 172 211, 166 240 C 137 227, 109 229, 87 238 C 92 207, 96 177, 100 146 Z"
            fill="url(#win-blueGrad)"
            stroke="url(#win-goldBorder)"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M 103 149 C 129 142, 155 142, 180 153 C 177 174, 175 188, 171 198 C 147 186, 122 186, 93 200 C 97 182, 100 165, 103 149 Z"
            fill="url(#win-blueGloss)"
            opacity="0.6"
          />
        </g>

        {/* Yellow Pane */}
        <g>
          <path
            d="M 197 153 C 226 162, 252 159, 269 151 C 263 182, 258 212, 251 241 C 233 249, 209 250, 182 243 C 187 213, 192 183, 197 153 Z"
            fill="url(#win-yellowGrad)"
            stroke="url(#win-goldBorder)"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M 200 156 C 226 165, 248 163, 265 155 C 262 176, 259 189, 255 199 C 238 203, 218 201, 190 193 C 193 180, 197 168, 200 156 Z"
            fill="url(#win-yellowGloss)"
            opacity="0.6"
          />
        </g>
      </g>

      {/* ================= ORBIT RING: FRONT LOOP ================= */}
      <g filter="url(#win-glow-orange)">
        <path
          d="M 108 92 C 55 125, 6 182, 38 226 C 65 264, 172 272, 275 235 C 330 215, 375 178, 382 135 C 388 95, 362 66, 320 54"
          fill="none"
          stroke="url(#win-orbitGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        <path
          d="M 108 92 C 55 125, 6 182, 38 226 C 65 264, 172 272, 275 235 C 330 215, 375 178, 382 135 C 388 95, 362 66, 320 54"
          fill="none"
          stroke="url(#win-innerOrbitGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 45 220 C 72 254, 170 263, 270 228 C 322 208, 368 174, 375 136"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          opacity="0.85"
        />
      </g>

      <path
        d="M 112 110 C 70 140, 36 188, 62 222 C 86 253, 178 259, 268 225 C 318 206, 356 172, 362 136"
        fill="none"
        stroke="#ffb703"
        strokeWidth="1.6"
        opacity="0.65"
      />

      {/* Sparkling motes */}
      <g fill="#ffe066" opacity="0.85">
        <circle cx="242" cy="38" r="1.8" />
        <circle cx="264" cy="32" r="1.2" />
        <circle cx="282" cy="42" r="2.2" />
        <circle cx="270" cy="54" r="1.5" />
        <circle cx="340" cy="40" r="1.4" />
        <circle cx="352" cy="62" r="2.0" />
        <circle cx="365" cy="78" r="1.5" />
        <circle cx="378" cy="98" r="2.2" fill="#70f0ff" />
        <circle cx="388" cy="120" r="1.6" fill="#70f0ff" />
        <circle cx="330" cy="190" r="1.8" fill="#70f0ff" />
        <circle cx="270" cy="245" r="1.6" fill="#ffd000" />
        <circle cx="160" cy="265" r="2.0" fill="#ff9900" />
        <circle cx="78" cy="248" r="1.6" fill="#ff7700" />
        <circle cx="32" cy="205" r="1.8" fill="#ff6600" />
      </g>

      {/* ================= STARBURST FLARE ================= */}
      <g transform="translate(320, 54)" filter="url(#win-glow-star)">
        <circle cx="0" cy="0" r="18" fill="#ffd700" opacity="0.35" />
        <circle cx="0" cy="0" r="10" fill="#fff275" opacity="0.65" />
        <circle cx="0" cy="0" r="4.5" fill="#ffffff" />

        <polygon points="0,-46 2.5,-8 38,0 2.5,8 0,46 -2.5,8 -38,0 -2.5,-8" fill="#fff9c4" opacity="0.95" />
        <polygon points="0,-46 1.2,-5 38,0 1.2,5 0,46 -1.2,5 -38,0 -1.2,-5" fill="#ffffff" />

        <polygon points="-28,-28 -2,-5 28,-28 5,-2 28,28 2,5 -28,28 -5,2" fill="#ffd54f" opacity="0.85" />
        <polygon points="-20,-20 -1.5,-3 20,-20 3,-1.5 20,20 1.5,3 -20,20 -3,1.5" fill="#ffffff" opacity="0.9" />

        <line x1="-15" y1="-30" x2="15" y2="30" stroke="#ffe082" strokeWidth="1.2" opacity="0.75" />
        <line x1="30" y1="-15" x2="-30" y2="15" stroke="#ffe082" strokeWidth="1.2" opacity="0.75" />
        <line x1="-30" y1="-15" x2="30" y2="15" stroke="#ffe082" strokeWidth="1.2" opacity="0.75" />
        <line x1="15" y1="-30" x2="-15" y2="30" stroke="#ffe082" strokeWidth="1.2" opacity="0.75" />
      </g>
    </svg>
  );
};
